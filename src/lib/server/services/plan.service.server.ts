import type { Plan } from '$lib/schema/plan.schema';
import { ActionResponse, type EarnItActionResult } from '$lib/utils/action-result';
import { and, eq, isNull } from 'drizzle-orm';
import db from '../database/drizzle';
import { plan_subscription_table, plan_table } from '../database/schema';
import { CreatorManagmentService } from './creator.management.service.server';

async function getPlans(): Promise<Plan[]> {
	const plans = await db.select().from(plan_table);
	return plans;
}

async function getSubscribedPlans(followerId: number, creatorId: number): Promise<Plan[]> {
	const plans = await db
		.select({
			id: plan_table.id,
			name: plan_table.name,
			description: plan_table.description,
			plan_percent: plan_table.plan_percent,
			plan_cost: plan_table.plan_cost
		})
		.from(plan_table)
		.innerJoin(plan_subscription_table, eq(plan_table.id, plan_subscription_table.plan_id))
		.where(
			and(
				eq(plan_subscription_table.follower_user_id, followerId),
				eq(plan_subscription_table.creator_user_id, creatorId),
				isNull(plan_subscription_table.date_canceled)
			)
		);
	return plans;
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

		//Check to make sure this user is not already subscribed to this plan
		const existingSubscriptions = await db
			.select()
			.from(plan_subscription_table)
			.where(
				and(
					eq(plan_subscription_table.follower_user_id, followerId),
					eq(plan_subscription_table.creator_user_id, creatorId),
					eq(plan_subscription_table.plan_id, planId),
					isNull(plan_subscription_table.date_canceled)
				)
			);

		if (existingSubscriptions.length > 0) {
			console.log('You are already subscribed to this plan');
			return ActionResponse.fail('You are already subscribed to this plan');
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

		//follow this user also if not following
		await CreatorManagmentService.addFollower(creatorId, followerId);

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
	unsubscribeFromPlan
};
