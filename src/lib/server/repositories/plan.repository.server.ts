import { isNull, and, eq, desc } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { plan_subscription, plan } from '../database/schema';
import type { PlanSubscription, PlanSubscriptionWithPercent } from '$lib/schema/plan.schema';

async function getActivePlanSubscriptions(): Promise<PlanSubscription[]> {
	const where = isNull(plan_subscription.date_canceled);

	const plans = await db.select().from(plan_subscription).where(where);

	return plans;
}

async function getActivePlanSubscriptionsByUser(
	creator_user_id: number,
	follower_user_id: number
): Promise<PlanSubscription[]> {
	const where = and(
		eq(plan_subscription.creator_user_id, creator_user_id),
		eq(plan_subscription.follower_user_id, follower_user_id),
		isNull(plan_subscription.date_canceled)
	);

	const plans = await db.select().from(plan_subscription).where(where);

	return plans;
}

async function getActivePlanSubscriptionsWithPercentage(
	creator_user_id: number,
	follower_user_id: number
): Promise<PlanSubscriptionWithPercent[]> {
	const where = and(
		eq(plan_subscription.creator_user_id, creator_user_id),
		eq(plan_subscription.follower_user_id, follower_user_id),
		isNull(plan_subscription.date_canceled)
	);

	const plans = await db
		.select({
			id: plan.id,
			name: plan.name,
			plan_percent: plan.plan_percent
		})
		.from(plan)
		.innerJoin(plan_subscription, eq(plan_subscription.plan_id, plan.id))
		.where(where)
		.orderBy(desc(plan.plan_percent));

	return plans;
}

async function getPlanById(planId: number) {
	const plans = await db.select().from(plan).where(eq(plan.id, planId));
	return plans.length > 0 ? plans[0] : null;
}

export const PlanRepository = {
	getActivePlanSubscriptions,
	getActivePlanSubscriptionsByUser,
	getActivePlanSubscriptionsWithPercentage,
	getPlanById
};
