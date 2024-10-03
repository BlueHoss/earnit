import type { Plan, PlanWithSubscription } from '$lib/schema/plan.schema';
import { ActionResponse, type EarnItActionResult } from '$lib/utils/action-result';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import db from '../database/drizzle';
import { plan_subscription_table, plan_table } from '../database/schema';
import { MissionService } from './mission.service.server';
import { UserService } from './user.service.server';
import type { User } from 'lucia';

async function getPlans(): Promise<Plan[]> {
	const plans = await db.select().from(plan_table).orderBy(plan_table.plan_cost);
	return plans;
}

export interface PlanPageData {
	SubscriberPlans: PlanWithSubscription[];
	CreatorMissionCredits: number;
	Creator: User;
}

async function getSubscribePageData(followerId: number, creatorId: number): Promise<PlanPageData> {
	const missionCredits = await MissionService.getDailyTotalMissionCredits(creatorId);
	const plans = await getSubscribedPlans(followerId, creatorId, missionCredits);
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
	const plans = await getSubscribedPlans(followerId, creatorId, 0);
	const plan = plans.find((p) => p.currentPlan);
	return plan ?? null;
}

async function getSubscribedPlans(
	followerId: number,
	creatorId: number,
	missionCredits: number
): Promise<PlanWithSubscription[]> {
	const plans = await db
		.select({
			id: plan_table.id,
			name: plan_table.name,
			description: plan_table.description,
			plan_percent: plan_table.plan_percent,
			plan_cost: plan_table.plan_cost,
			creator_user_id: plan_subscription_table.creator_user_id,
			follower_user_id: plan_subscription_table.follower_user_id,
			date_started: plan_subscription_table.date_started,
			features: sql<string[] | null>`CAST(NULL AS TEXT[])`,
			currentPlan: sql<boolean>`CAST(NULL AS BOOLEAN)`
		})
		.from(plan_table)
		.leftJoin(
			plan_subscription_table,
			and(
				eq(plan_table.id, plan_subscription_table.plan_id),
				eq(plan_subscription_table.follower_user_id, followerId),
				eq(plan_subscription_table.creator_user_id, creatorId),
				isNull(plan_subscription_table.date_canceled)
			)
		)
		.orderBy(desc(plan_table.plan_cost));

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
	planId: number
): Promise<EarnItActionResult> {
	try {
		const plandb = await db.select().from(plan_table).where(eq(plan_table.id, planId));

		if (plandb.length === 0) {
			console.log('No plan found with the given ID');
			return ActionResponse.fail('No product found with the given ID');
		}

		//Check to make sure this user is not already subscribed to this store
		const existingSubscriptions = await db
			.select()
			.from(plan_subscription_table)
			.where(
				and(
					eq(plan_subscription_table.follower_user_id, followerId),
					eq(plan_subscription_table.creator_user_id, creatorId),
					//eq(plan_subscription_table.plan_id, planId),
					isNull(plan_subscription_table.date_canceled)
				)
			);

		if (existingSubscriptions.length > 0) {
			await existingSubscriptions.forEach((sub) => {
				unsubscribeFromPlan(creatorId, followerId, sub.plan_id);
			});
		}

		//Insert a plan subscription.
		const subscriptionPlan = {
			follower_user_id: followerId,
			creator_user_id: creatorId,
			plan_id: planId,
			date_started: new Date().toUTCString(),
			active: true
		};

		// Get existing follower's credit balance for this creator
		await db.insert(plan_subscription_table).values(subscriptionPlan);

		return ActionResponse.success('Plan subscription success!');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while purchaing the plan. Please try again later.'
		);
	}
}

async function unsubscribeFromPlan(
	creatorId: number,
	followerId: number,
	planId: number
): Promise<EarnItActionResult> {
	try {
		const plandb = await db.select().from(plan_table).where(eq(plan_table.id, planId));

		if (plandb.length === 0) {
			console.log('No plan found with the given ID');
			return ActionResponse.fail('No product found with the given ID');
		}

		// Get existing follower's credit balance for this creator
		await db
			.update(plan_subscription_table)
			.set({ date_canceled: new Date().toUTCString() })
			.where(
				and(
					eq(plan_subscription_table.follower_user_id, followerId),
					eq(plan_subscription_table.creator_user_id, creatorId),
					eq(plan_subscription_table.plan_id, planId),
					isNull(plan_subscription_table.date_canceled)
				)
			);

		return ActionResponse.success('Plan unsubscribe success!');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while purchaing the plan. Please try again later.'
		);
	}
}

export const PlanService = {
	getPlans,
	purchaseRecurringPlan,
	getSubscribedPlans,
	unsubscribeFromPlan,
	getSubscribePageData,
	getSubscriberPlan
};
