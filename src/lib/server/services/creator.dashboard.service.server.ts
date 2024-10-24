import { eq, and, sql, sum, between, type SQL, isNull, gt, lt, lte, ne } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	credit_transaction,
	login,
	mission_action,
	mission_creator,
	mission,
	plan_subscription,
	plan,
	product_invoice,
	product
} from '$lib/server/database/schema';
import type { ProductInvoiceResult } from '$lib/schema/product_invoice.schema';
import { ProductService } from './product.service.server';
import type { CreatorDashboard, CreatorMarketplaceData } from '$lib/types';
import { type DefaultMission, type MissionAction } from '$lib/schema/mission.schema';
import { TRANSACTION_TYPES } from './credit.service.server';

/**
 * Retrieves the number of paid subscribers for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @returns {Promise<number>} - The number of paid subscribers.
 */
async function getPaidSubscribers(userid: number) {
	const count = await db
		.select({
			count: sql<number>`count(*) as integer`
		})
		.from(plan_subscription)
		.innerJoin(plan, eq(plan_subscription.id, plan.id))
		.where(
			and(isNull(plan_subscription.date_canceled), eq(plan_subscription.creator_user_id, userid))
		);

	if (count.length === 0) {
		return 0;
	} else {
		return count[0].count;
	}
}

/**
 * Retrieves the expected monthly revenue for a given Creator based on total subscribers.
 *
 * @param {number} userid - The ID of the user.
 * @returns {Promise<number>} - The monthly revenue.
 */
async function getMonthlyRevenue(userid: number) {
	const count = await db
		.select({
			total: sum(plan.plan_cost).as('total')
		})
		.from(plan_subscription)
		.innerJoin(plan, eq(plan_subscription.id, plan.id))
		.where(
			and(isNull(plan_subscription.date_canceled), eq(plan_subscription.creator_user_id, userid))
		);

	if (count.length === 0) {
		return 0;
	} else {
		return Number(count[0].total);
	}
}

/**
 * Retrieves the credits used for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Promise<number>} - The credits used.
 */
async function getCreditAmountDistributed(creatorId: number) {
	const count = await db
		.select({
			total: sql`SUM(${credit_transaction.amount})`.as('total')
		})
		.from(credit_transaction)
		.where(
			and(
				eq(credit_transaction.creator_user_id, creatorId),
				ne(credit_transaction.transaction_type, TRANSACTION_TYPES.Product_Redemption)
			)
		);

	if (count.length === 0) {
		return 0;
	} else {
		return Number(count[0].total);
	}
}

/**
 * Retrieves the number of products purchased for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Promise<number>} - The number of products purchased.
 */

async function getProductsPurchasedCount(
	userid: number,
	startDate: Date | null,
	endDate: Date | null
) {
	let whereClause: SQL<unknown> | undefined = eq(product_invoice.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(whereClause, between(product_invoice.date_purchased, startDate, endDate));
	}

	const count = await db
		.select({
			count: sql<number>`count(*) as integer`
		})
		.from(product_invoice)
		.where(whereClause);

	if (count.length === 0) {
		return 0;
	} else {
		return Number(count[0].count);
	}
}

/**
 * Retrieves the amount of products purchased for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Promise<number>} - The amount of products purchased.
 */
async function getProductsPurchasedAmount(userid: number, startDate: Date, endDate: Date) {
	let whereClause: SQL<unknown> | undefined = eq(product_invoice.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(whereClause, between(product_invoice.date_purchased, startDate, endDate));
	}

	const count = await db
		.select({
			total: sum(product_invoice.cost)
		})
		.from(product_invoice)
		.where(whereClause);

	if (count.length === 0) {
		return 0;
	} else {
		return Number(count[0].total);
	}
}

/**
 * Retrieves the list of products purchased for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Promise<ProductPurchase[]>} - The list of products purchased.
 */
async function getProductsPurchasedList(
	userid: number,
	startDate: Date,
	endDate: Date
): Promise<ProductInvoiceResult[]> {
	let whereClause: SQL<unknown> | undefined = eq(product_invoice.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(whereClause, between(product_invoice.date_purchased, startDate, endDate));
	}

	const list = await db
		.select({
			id: product.id,
			product_name: product.name,
			follower: sql`${login.first_name} || ' ' || ${login.last_name}`.as('follower'),
			handle: login.handle,
			cost: product_invoice.cost
		})
		.from(product)
		.innerJoin(product_invoice, eq(product.id, product_invoice.product_id))
		.innerJoin(login, eq(product_invoice.follower_user_id, login.id))
		.where(whereClause);

	return list.map((item) => ({
		id: item.id,
		product_name: item.product_name,
		follower: item.follower as string | null,
		handle: item.handle,
		cost: Number(item.cost)
	}));
}

// /**
//  * Retrieves the number of followers for a given Creator.
//  *
//  * @param {number} userid - The ID of the user.
//  * @returns {Promise<number>} - The number of followers.
//  */
// async function getCreatorFollowerCount(userid: number): Promise<number> {
// 	const followerCount = await db
// 		.select({
// 			follower_count: sql<number>`count(${follower_creator.follower_user_id})`.as(
// 				'follower_count'
// 			)
// 		})
// 		.from(follower_creator)
// 		.innerJoin(login, eq(login.id, follower_creator.creator_user_id))
// 		.where(eq(follower_creator.creator_user_id, userid));

// 	if (followerCount.length === 0) {
// 		return 0;
// 	} else {
// 		return Number(followerCount[0].follower_count);
// 	}
// }

// async function getFollowerNameList(creatorId: number): Promise<{ handle: string }[]> {
// 	const followers = await db
// 		.select({
// 			handle: login.handle
// 		})
// 		.from(follower_creator)
// 		.innerJoin(login, eq(login.id, follower_creator.creator_user_id))
// 		.where(eq(follower_creator.creator_user_id, creatorId));

// 	return !followers ? [] : followers;
// }

async function getSubscriberNameList(creatorId: number): Promise<{ handle: string }[]> {
	const subscribers = await db
		.select({
			handle: login.handle
		})
		.from(plan_subscription)
		.innerJoin(login, eq(login.id, plan_subscription.follower_user_id))
		.innerJoin(plan, eq(plan_subscription.plan_id, plan.id))
		.where(and(eq(plan_subscription.creator_user_id, creatorId), gt(plan.plan_cost, '0.00')));
	return !subscribers ? [] : subscribers;
}

async function getFreeSubscriberNameList(creatorId: number): Promise<{ handle: string }[]> {
	const subscribers = await db
		.select({
			handle: login.handle
		})
		.from(plan_subscription)
		.innerJoin(login, eq(login.id, plan_subscription.follower_user_id))
		.innerJoin(plan, eq(plan_subscription.plan_id, plan.id))
		.where(and(eq(plan_subscription.creator_user_id, creatorId), eq(plan.plan_cost, '0.00')));
	return !subscribers ? [] : subscribers;
}

// /**
//  * returns the followers (from login table) of a creator
//  *
//  * @param userid
//  *  @returns LoginQueryResult[]
//  */
// async function getCreatorFollowerList(userid: number): Promise<LoginQueryResult[]> {
// 	const followers = await db
// 		.select({
// 			id: login.id,
// 			handle: login.handle,
// 			email: login.email,
// 			firstName: login.first_name,
// 			lastName: login.last_name,
// 			profilePic: login.profile_pic
// 		})
// 		.from(login)
// 		.innerJoin(follower_creator, eq(login.id, follower_creator.follower_user_id))
// 		.where(eq(follower_creator.creator_user_id, userid));

// 	return followers;
// }

async function getCreatorMissions(userid: number): Promise<DefaultMission[]> {
	const missions = await db
		.select({
			id: mission.id,
			name: mission.name,
			description: mission.description,
			platform: mission.platform,
			enabled: mission_creator.enabled
		})
		.from(mission)
		.innerJoin(mission_creator, eq(mission.id, mission_creator.mission_id))
		.where(and(eq(mission_creator.creator_user_id, userid), eq(mission_creator.enabled, true)));

	for (const mission of missions) {
		const actions = await db
			.select()
			.from(mission_action)
			.where(
				and(eq(mission_action.mission_id, mission.id), eq(mission_action.creator_user_id, userid))
			);
		mission.actions = actions;
	}
	return missions;
}

async function getMissionActionList(userid: number): Promise<MissionAction[]> {
	const actions = await db
		.select()
		.from(mission_action)
		.where(eq(mission_action.creator_user_id, userid))
		.orderBy(mission_action.name);

	return actions;
}

/**
 * Retrieves the number of enabled products for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @returns {Promise<number>} - The number of enabled products.
 */
async function getProductCount(userid: number): Promise<number> {
	const productCount = await db
		.select({
			count: sql<number>`count(*)`.as('count')
		})
		.from(product)
		.where(and(eq(product.creator_user_id, userid), eq(product.enabled, true)));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

async function loadMarketplaceData(creatorUserId: number): Promise<CreatorMarketplaceData> {
	const subscriberCount = await getPaidSubscribers(creatorUserId);
	const purchaseCount = await getProductsPurchasedCount(creatorUserId, null, null);
	const products = await ProductService.getProductsByUserId(creatorUserId);
	const followerCount = await getCreatorFollowerCount(creatorUserId);
	const productCount = await getProductCount(creatorUserId);
	const missions = await getCreatorMissions(creatorUserId);

	return (await {
		subscriberCount,
		purchaseCount,
		followerCount,
		productCount,
		products,
		missions
	}) as CreatorMarketplaceData;
}

async function loadDashboardData(creatorUserId: number): Promise<CreatorDashboard> {
	//Sliding 30 day window
	// Get today's date
	const endDate = new Date();
	// Get the date 30 days ago
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);

	const creditsDistributed = await getCreditAmountDistributed(creatorUserId);
	const purchaseCount = await getProductsPurchasedCount(creatorUserId, startDate, endDate);
	const purchaseAmount = await getProductsPurchasedAmount(creatorUserId, startDate, endDate);
	const productPurchaseList = await getProductsPurchasedList(creatorUserId, startDate, endDate);
	const freeSubscribers = await getFreeSubscriberNameList(creatorUserId);
	const subscribers = await getSubscriberNameList(creatorUserId);
	const productCount = await getProductCount(creatorUserId);
	const products = await ProductService.getProductsByUserId(creatorUserId);
	const missions = await getCreatorMissions(creatorUserId);

	const revenue = await getMonthlyRevenue(creatorUserId);

	return (await {
		subscribers,
		freeSubscribers,
		revenue,
		creditsDistributed,
		purchaseCount,
		purchaseAmount,
		productCount,
		productPurchaseList,
		products,
		missions
	}) as CreatorDashboard;
}

export const CreatorDashboardService = {
	loadDashboardData,
	loadMarketplaceData,
	getMissionActionList
};
