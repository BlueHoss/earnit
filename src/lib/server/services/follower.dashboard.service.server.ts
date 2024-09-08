import {
	follower_creator_table,
	login_table,
	plan_subscription_table,
	plan_table,
	product_invoice_table,
	reward_earned_table
} from '$lib/server/database/schema';
import { and, eq, sql } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import type { Follower, Subsciption } from '$lib/schema/follower_dashboard.schema';

async function availableCredits(followerId: number) {
	const productCount = await db
		.select({
			count: sql<number>`sum(reward_value)`.as('count')
		})
		.from(reward_earned_table)
		.where(eq(reward_earned_table.follower_user_id, followerId));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function subscriptionCount(followerId: number) {
	const productCount = await db
		.select({
			count: sql<number>`count(*)`.as('count')
		})
		.from(plan_subscription_table)
		.where(eq(plan_subscription_table.follower_user_id, followerId));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function followingCount(followerId: number) {
	const productCount = await db
		.select({
			count: sql<number>`count(*)`.as('count')
		})
		.from(follower_creator_table)
		.where(eq(follower_creator_table.follower_user_id, followerId));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function creditsRedeemed(followerId: number) {
	const productCount = await db
		.select({
			count: sql<number>`sum(cost)`.as('count')
		})
		.from(product_invoice_table)
		.where(eq(product_invoice_table.follower_user_id, followerId));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function getSubscribeList(followerId: number): Promise<Subsciption[]> {
	const list = await db
		.select({
			creator_user_id: plan_subscription_table.creator_user_id,
			store_name: login_table.store_name,
			title: login_table.title,
			follower_count: login_table.follower_count,
			profile_pic: login_table.profile_pic,
			date_started: plan_subscription_table.date_started,
			name: plan_table.name,
			plan_cost: plan_table.cost
		})
		.from(login_table)
		.innerJoin(plan_subscription_table, eq(plan_subscription_table.creator_user_id, login_table.id))
		.innerJoin(plan_table, eq(plan_table.id, plan_subscription_table.plan_id))
		.where(
			and(
				eq(plan_subscription_table.follower_user_id, followerId),
				eq(plan_subscription_table.active, true)
			)
		);
	return list;
}

async function getFollowerList(followerId: number): Promise<Follower[]> {
	const list = await db
		.select({
			store_name: login_table.store_name,
			title: login_table.title,
			creator_user_id: follower_creator_table.creator_user_id,
			profile_pic: login_table.profile_pic
		})
		.from(follower_creator_table)
		.innerJoin(login_table, eq(login_table.id, follower_creator_table.creator_user_id))
		.where(eq(follower_creator_table.follower_user_id, followerId));
	return list;
}

async function loadDashboardData(followerUserId: number) {
	return {
		availableCredits: await availableCredits(followerUserId),
		subscriptionCount: await subscriptionCount(followerUserId),
		followingCount: await followingCount(followerUserId),
		creditsRedeemed: await creditsRedeemed(followerUserId),
		subscriberList: await getSubscribeList(followerUserId),
		followerList: await getFollowerList(followerUserId)
	};
}

export const FollowersDashboardService = {
	loadDashboardData,
	availableCredits
};
