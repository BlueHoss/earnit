import type { Plan, PlanWithSubscription } from '$lib/schema/plan.schema';
import { ActionResponse, type EarnItActionResult } from '$lib/utilities/action-result';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { plan_subscription, plan } from '../database/schema';
import { MissionService } from './mission.service.server';
import { UserService } from './user.service.server';
import type { User } from 'lucia';
import { LoggerService } from './logger.service.server';
import { PaymentService } from './payment.service.server';
import { PlanRepository } from '../repositories/plan.repository.server';
import { ScannerRepository } from '../repositories/scanner.repository.server';

export interface PlanPageData {
	SubscriberPlans: PlanWithSubscription[];
	CreatorMissionCredits: number;
	Creator: User;
}

async function getSubscribePageData(followerId: number, creatorId: number): Promise<PlanPageData> {
	const missionCredits = await MissionService.getDailyTotalMissionCredits(creatorId);
	const plans = await getSubscribedPlans(followerId, creatorId);
	const creator = await UserService.getSessioUser(creatorId);

	return {
		SubscriberPlans: plans,
		CreatorMissionCredits: missionCredits,
		Creator: creator
	} as PlanPageData;
}

async function getSubscriberPlan(
	followerId: number,
	creatorId: number
): Promise<PlanWithSubscription | null> {
	const plans = await getSubscribedPlans(followerId, creatorId);
	const plan = plans.find((p) => p.currentPlan);
	return plan ?? null;
}

async function getSubscribedPlans(
	followerId: number,
	creatorId: number
): Promise<PlanWithSubscription[]> {
	const plans = await db
		.select({
			id: plan.id,
			name: plan.name,
			level: plan.level,
			description: plan.description,
			plan_percent: plan.plan_percent,
			plan_cost: plan.plan_cost,
			stripe_subscription_id: plan_subscription.stripe_subscription_id,
			creator_user_id: plan_subscription.creator_user_id,
			follower_user_id: plan_subscription.follower_user_id,
			date_started: plan_subscription.date_started,
			features: sql<string[] | null>`CAST(NULL AS TEXT[])`,
			currentPlan: sql<boolean>`CAST(NULL AS BOOLEAN)`
		})
		.from(plan)
		.leftJoin(
			plan_subscription,
			and(
				eq(plan.id, plan_subscription.plan_id),
				eq(plan_subscription.follower_user_id, followerId),
				eq(plan_subscription.creator_user_id, creatorId),
				isNull(plan_subscription.date_canceled)
			)
		)
		.orderBy(desc(plan.plan_cost));

	const missionCredits = await MissionService.getDailyTotalMissionCredits(creatorId);

	if (missionCredits == 0) {
		const processedPlans = plans.map((plan) => ({
			...plan,
			features: [],
			currentPlan: plan.creator_user_id === creatorId
		}));
		return processedPlans;
	} else {
		const processedPlans = plans.map((plan) => ({
			...plan,
			features: [
				`${plan.plan_percent}% rewards`,
				`Daily Unlock: ${Math.round((missionCredits * Number(plan.plan_percent)) / 100)}`
			],
			currentPlan: plan.creator_user_id === creatorId
		}));
		return processedPlans;
	}
}

async function purchaseRecurringPlan(
	creatorId: number,
	followerId: number,
	planId: number,
	stripeSubscriptionId: string
): Promise<EarnItActionResult> {
	try {
		const newPlanDb = await db.select().from(plan).where(eq(plan.id, planId));

		if (newPlanDb.length === 0) {
			console.log('No plan found with the given ID');
			return ActionResponse.fail('No product found with the given ID');
		}
		//Cancel existing subscriptions.
		const cancelResult = await cancelExistingSubscriptions(followerId, creatorId);

		if (!cancelResult.success) {
			return ActionResponse.fail('An error occurred while canceling the existing subscription');
		}

		//Insert a plan subscription.
		const subscriptionPlan = {
			follower_user_id: followerId,
			creator_user_id: creatorId,
			plan_id: planId,
			date_started: new Date().toUTCString(),
			active: true,
			stripe_subscription_id: stripeSubscriptionId
		};

		await db.insert(plan_subscription).values(subscriptionPlan);

		//handle Creator in Scanner Tool.
		handleCreatorInScannerTool(creatorId);

		return ActionResponse.success('Plan subscription success!');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while purchaing the plan. Please try again later.'
		);
	}
}

async function handleCreatorInScannerTool(creatorId: number) {
	const creator = await UserService.getUserByUserId(creatorId);
	if (!creator) {
		return;
	}

	if (!creator.social_media_profile) {
		LoggerService.error(
			'Creator does not have a social media profile. Followers will not be rewarded.',
			`Creator: ${creatorId}`
		);
		return;
	}

	const isInScannerTool = await ScannerRepository.getPublicProfileFromSocialMediaHandle(
		creator.social_media_profile
	);

	if (!isInScannerTool) {
		await ScannerRepository.addCreatorToPublicProfile(creator.social_media_profile);
	}
}

async function cancelExistingSubscriptions(
	followerId: number,
	creatorId: number
): Promise<EarnItActionResult> {
	try {
		const existingSubscriptions = await PlanRepository.getActivePlanSubscriptionsByUser(
			creatorId,
			followerId
		);

		for (let index = 0; index < existingSubscriptions.length; index++) {
			const sub = existingSubscriptions[index];
			cancelSubscription(followerId, creatorId, sub.plan_id);
		}

		//handle removing creator from Scanner Tool.
		handleRemoveCreatorFromScannerTool(creatorId);

		return ActionResponse.success('Plan unsubscribe success!');
	} catch (error) {
		LoggerService.handleError(error, 'Error canceling Stripe subscription');
		return ActionResponse.fail(
			'An error occurred while purchaing the plan. Please try again later.'
		);
	}
}

/**
 * Remove the creator from the Scanner Tool if they have no active subscriptions.
 * @param creatorId
 */
async function handleRemoveCreatorFromScannerTool(creatorId: number) {
	//TBD - Waiting on a feature from Indrit to set the creator as Inactive rather than delete them.
}

async function cancelSubscription(
	followerId: number,
	creatorId: number,
	planId: number
): Promise<EarnItActionResult> {
	try {
		const existingSubscription = await PlanRepository.getActivePlanSubscriptionsByUser(
			creatorId,
			followerId
		);

		for (let index = 0; index < existingSubscription.length; index++) {
			const sub = existingSubscription[index];
			await db
				.update(plan_subscription)
				.set({ date_canceled: new Date().toUTCString() })
				.where(eq(plan_subscription.id, sub.id));

			if (sub.stripe_subscription_id) {
				// Cancel subscription in Stripe
				const canceledSubscription = await PaymentService.cancelSubscription(
					sub.stripe_subscription_id
				);
				if (!canceledSubscription.success) {
					LoggerService.error(
						'Error canceling Stripe subscription for User',
						`User: ${followerId} stripe_subscription_id: ${sub.stripe_subscription_id} attempting to cancel planId: ${planId}`
					);
				}
			}
		}

		return ActionResponse.success('Plan unsubscribe success!');
	} catch (error) {
		LoggerService.handleError(error, 'Error canceling Stripe subscription with planId' + planId);
		return ActionResponse.fail(
			'An error occurred while purchaing the plan. Please try again later.'
		);
	}
}

export const PlanService = {
	purchaseRecurringPlan,
	getSubscribedPlans,
	getSubscribePageData,
	getSubscriberPlan,
	cancelSubscription
};
