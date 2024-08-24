import { eq, and, sql, sum } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { plan_subscription_table, plan_table } from '$lib/server/database/schema';
//import type { User, UpdateUser } from '$lib/server/database/drizzle-schemas';

export const getPaidSubscribers = async (userid: number) => {
	const count = await db
		.select({
			count: sql<number>`count(*) as integer`
		})
		.from(plan_subscription_table)
		.innerJoin(plan_table, eq(plan_subscription_table.id, plan_table.id))
		.where(
			and(
				eq(plan_subscription_table.active, true),
				eq(plan_subscription_table.creator_user_id, userid)
			)
		);

	if (count.length === 0) {
		return 0;
	} else {
		return count[0].count;
	}
};

export const getMonthlyRevenue = async (userid: number) => {
	const count = await db
		.select({
			total: sum(plan_table.cost)
		})
		.from(plan_subscription_table)
		.innerJoin(plan_table, eq(plan_subscription_table.id, plan_table.id))
		.where(
			and(
				eq(plan_subscription_table.active, true),
				eq(plan_subscription_table.creator_user_id, userid)
			)
		);

	if (count.length === 0) {
		return 0;
	} else {
		return Number(count[0].total);
	}
};
