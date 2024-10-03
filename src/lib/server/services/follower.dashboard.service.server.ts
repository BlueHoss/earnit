import {
	credit_follower_balance_table,
	login_table,
	plan_subscription_table,
	plan_table,
	product_invoice_table
} from '$lib/server/database/schema';
import { and, eq, isNull, sql } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import type { Subsciption } from '$lib/schema/follower_dashboard.schema';
import type { FollowerCreditBalanceDetail } from '$lib/schema/credit.schema';
import { ProductService } from './product.service.server';

async function availableCredits(followerId: number) {
	const followerCredits = await db
		.select({
			credits: sql<number>`sum(credit_balance)`.as('credits')
		})
		.from(credit_follower_balance_table)
		.where(eq(credit_follower_balance_table.follower_user_id, followerId));

	if (followerCredits.length === 0) {
		return 0;
	} else {
		return Number(followerCredits[0].credits);
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

// async function followingCount(followerId: number) {
// 	const productCount = await db
// 		.select({
// 			count: sql<number>`count(*)`.as('count')
// 		})
// 		.from(follower_creator_table)
// 		.where(eq(follower_creator_table.follower_user_id, followerId));

// 	if (productCount.length === 0) {
// 		return 0;
// 	} else {
// 		return Number(productCount[0].count);
// 	}
// }

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
			plan_cost: plan_table.plan_cost
		})
		.from(login_table)
		.innerJoin(plan_subscription_table, eq(plan_subscription_table.creator_user_id, login_table.id))
		.innerJoin(plan_table, eq(plan_table.id, plan_subscription_table.plan_id))
		.where(
			and(
				eq(plan_subscription_table.follower_user_id, followerId),
				isNull(plan_subscription_table.date_canceled)
			)
		);
	return list;
}

// async function getFollowerList(followerId: number): Promise<Follower[]> {
// 	const list = await db
// 		.select({
// 			store_name: login_table.store_name,
// 			title: login_table.title,
// 			creator_user_id: follower_creator_table.creator_user_id,
// 			profile_pic: login_table.profile_pic,
// 			credit_follower_balance_table: credit_follower_balance_table.credit_balance
// 		})
// 		.from(follower_creator_table)
// 		.innerJoin(login_table, eq(login_table.id, follower_creator_table.creator_user_id))
// 		.leftJoin(
// 			credit_follower_balance_table,
// 			eq(credit_follower_balance_table.creator_user_id, follower_creator_table.creator_user_id)
// 		)
// 		.where(eq(follower_creator_table.follower_user_id, followerId));
// 	return list;
// }

async function loadDashboardData(followerUserId: number) {
	return {
		availableCredits: await availableCredits(followerUserId),
		subscriptionCount: await subscriptionCount(followerUserId),
		creditsRedeemed: await creditsRedeemed(followerUserId),
		subscriberList: await getSubscribeList(followerUserId),
		productsPurchased: await ProductService.getProductsPurchasedByFollower(followerUserId),
		creditBalanceDetails: await getFollowerCreditBalanceDetails(followerUserId)
	};
}

async function getFollowerCreditsByCreator(followerId: number, creatorId: number) {
	const followerCreditAmount = await db
		.select({
			count: credit_follower_balance_table.credit_balance
		})
		.from(credit_follower_balance_table)
		.where(
			and(
				eq(credit_follower_balance_table.follower_user_id, followerId),
				eq(credit_follower_balance_table.creator_user_id, creatorId)
			)
		);

	if (followerCreditAmount.length === 0) {
		return 0;
	} else {
		return Number(followerCreditAmount[0].count);
	}
}

async function getFollowerProductsByCreatorList(
	followerId: number,
	creatorId: number
): Promise<{ id: number | null }[]> {
	const followerProductsByCreator = await db
		.select({
			id: product_invoice_table.product_id
		})
		.from(product_invoice_table)
		.where(
			and(
				eq(product_invoice_table.follower_user_id, followerId),
				eq(product_invoice_table.creator_user_id, creatorId)
			)
		);

	if (followerProductsByCreator == null || followerProductsByCreator.length === 0) {
		return [];
	} else {
		return followerProductsByCreator;
	}
}

async function getFollowerProductsPurchasedFromCreator(followerId: number, creatorId: number) {
	const productCount = await db
		.select({
			count: sql<number>`count(*)`.as('count')
		})
		.from(product_invoice_table)
		.where(
			and(
				eq(product_invoice_table.follower_user_id, followerId),
				eq(product_invoice_table.creator_user_id, creatorId)
			)
		);

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function getFollowerCreditBalanceDetails(
	followerId: number
): Promise<FollowerCreditBalanceDetail[]> {
	const balance = await db
		.select({
			creator_user_id: credit_follower_balance_table.creator_user_id,
			reward_name: login_table.reward_name,
			profile_pic: login_table.profile_pic,
			store_name: login_table.store_name,
			total_credits: sql<number>`SUM(${credit_follower_balance_table.credit_balance})`.as(
				'total_credits'
			),
			date: sql<Date>`MAX(${credit_follower_balance_table.date_updated})`.as('last_updated'),
			plan_name: plan_table.name
		})
		.from(credit_follower_balance_table)
		.innerJoin(
			login_table,
			sql`${login_table.id} = ${credit_follower_balance_table.creator_user_id}`
		)
		.leftJoin(
			plan_subscription_table,
			sql`${plan_subscription_table.creator_user_id} = ${login_table.id} AND 
		  ${plan_subscription_table.follower_user_id} = ${credit_follower_balance_table.follower_user_id}`
		)
		.leftJoin(plan_table, sql`${plan_subscription_table.plan_id} = ${plan_table.id}`)
		.where(sql`${credit_follower_balance_table.follower_user_id} = ${followerId}`)
		.groupBy(
			credit_follower_balance_table.creator_user_id,
			login_table.reward_name,
			login_table.profile_pic,
			login_table.store_name,
			plan_table.name
		)
		.orderBy(sql`total_credits DESC`, sql`last_updated DESC`);

	if (balance.length === 0) {
		return [];
	} else {
		return balance;
	}
}

export const FollowersDashboardService = {
	loadDashboardData,
	availableCredits,
	getFollowerCreditsByCreator,
	getFollowerProductsPurchasedFromCreator,
	getFollowerProductsByCreatorList,
	getFollowerCreditBalanceDetails
};
