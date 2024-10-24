import {
	credit_follower_balance,
	login,
	plan_subscription,
	plan,
	product_invoice
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
		.from(credit_follower_balance)
		.where(eq(credit_follower_balance.follower_user_id, followerId));

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
		.from(plan_subscription)
		.where(eq(plan_subscription.follower_user_id, followerId));

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
		.from(product_invoice)
		.where(eq(product_invoice.follower_user_id, followerId));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function getSubscribeList(followerId: number): Promise<Subsciption[]> {
	const list = await db
		.select({
			creator_user_id: plan_subscription.creator_user_id,
			store_name: login.store_name,
			title: login.title,
			follower_count: login.follower_count,
			profile_pic: login.profile_pic,
			date_started: plan_subscription.date_started,
			name: plan.name,
			plan_cost: plan.plan_cost
		})
		.from(login)
		.innerJoin(plan_subscription, eq(plan_subscription.creator_user_id, login.id))
		.innerJoin(plan, eq(plan.id, plan_subscription.plan_id))
		.where(
			and(
				eq(plan_subscription.follower_user_id, followerId),
				isNull(plan_subscription.date_canceled)
			)
		);
	return list;
}

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
			count: credit_follower_balance.credit_balance
		})
		.from(credit_follower_balance)
		.where(
			and(
				eq(credit_follower_balance.follower_user_id, followerId),
				eq(credit_follower_balance.creator_user_id, creatorId)
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
			id: product_invoice.product_id
		})
		.from(product_invoice)
		.where(
			and(
				eq(product_invoice.follower_user_id, followerId),
				eq(product_invoice.creator_user_id, creatorId)
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
		.from(product_invoice)
		.where(
			and(
				eq(product_invoice.follower_user_id, followerId),
				eq(product_invoice.creator_user_id, creatorId)
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
			creator_user_id: sql`COALESCE(${credit_follower_balance.creator_user_id}, ${plan_subscription.creator_user_id})`,
			reward_name: login.reward_name,
			social_media_profile: login.social_media_profile,
			profile_pic: login.profile_pic,
			store_name: login.store_name,
			total_credits: sql<number>`COALESCE(SUM(${credit_follower_balance.credit_balance}), 0)`.as(
				'total_credits'
			),
			plan_name: plan.name
		})
		.from(login)
		.leftJoin(
			plan_subscription,
			sql`${plan_subscription.follower_user_id} = ${followerId} AND 
		  ${plan_subscription.creator_user_id} = ${login.id} AND 
		  ${plan_subscription.date_canceled} IS NULL`
		)
		.leftJoin(plan, sql`${plan.id} = ${plan_subscription.plan_id}`)
		.leftJoin(
			credit_follower_balance,
			sql`${credit_follower_balance.creator_user_id} = ${login.id}`
		)
		.where(
			sql`${plan_subscription.follower_user_id} = ${followerId} OR 
		  ${credit_follower_balance.follower_user_id} = ${followerId}`
		)
		.groupBy(
			plan_subscription.creator_user_id,
			login.reward_name,
			login.profile_pic,
			login.store_name,
			plan.name,
			login.id,
			credit_follower_balance.creator_user_id
		)
		.orderBy(login.store_name);

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
