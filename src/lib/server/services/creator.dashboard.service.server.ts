import { eq, and, sql, sum, between, type SQL, isNull } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	credit_transaction_table,
	follower_creator_table,
	login_table,
	mission_action_table,
	mission_creator_table,
	mission_table,
	plan_subscription_table,
	plan_table,
	product_invoice_table,
	product_table
} from '$lib/server/database/schema';
import type { LoginQueryResult } from '$lib/schema/login.schema';
import type { ProductInvoiceResult } from '$lib/schema/product_invoice.schema';
import { ProductService } from './product.service.server';
import type { CreatorDashboard, CreatorMarketplaceData } from '$lib/types';
import { type DefaultMission, type MissionAction } from '$lib/schema/mission.schema';

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
		.from(plan_subscription_table)
		.innerJoin(plan_table, eq(plan_subscription_table.id, plan_table.id))
		.where(
			and(
				isNull(plan_subscription_table.date_canceled),
				eq(plan_subscription_table.creator_user_id, userid)
			)
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
			total: sum(plan_table.plan_cost).as('total')
		})
		.from(plan_subscription_table)
		.innerJoin(plan_table, eq(plan_subscription_table.id, plan_table.id))
		.where(
			and(
				isNull(plan_subscription_table.date_canceled),
				eq(plan_subscription_table.creator_user_id, userid)
			)
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
			total: sql`SUM(${credit_transaction_table.amount})`.as('total')
		})
		.from(credit_transaction_table)
		.where(eq(credit_transaction_table.creator_user_id, creatorId));

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
	let whereClause: SQL<unknown> | undefined = eq(product_invoice_table.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(
			whereClause,
			between(product_invoice_table.date_purchased, startDate, endDate)
		);
	}

	const count = await db
		.select({
			count: sql<number>`count(*) as integer`
		})
		.from(product_invoice_table)
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
	let whereClause: SQL<unknown> | undefined = eq(product_invoice_table.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(
			whereClause,
			between(product_invoice_table.date_purchased, startDate, endDate)
		);
	}

	const count = await db
		.select({
			total: sum(product_invoice_table.cost)
		})
		.from(product_invoice_table)
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
	let whereClause: SQL<unknown> | undefined = eq(product_invoice_table.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(
			whereClause,
			between(product_invoice_table.date_purchased, startDate, endDate)
		);
	}

	const list = await db
		.select({
			id: product_table.id,
			product_name: product_table.name,
			follower: sql`${login_table.first_name} || ' ' || ${login_table.last_name}`.as('follower'),
			handle: login_table.handle,
			cost: product_invoice_table.cost
		})
		.from(product_table)
		.innerJoin(product_invoice_table, eq(product_table.id, product_invoice_table.product_id))
		.innerJoin(login_table, eq(product_invoice_table.follower_user_id, login_table.id))
		.where(whereClause);

	return list.map((item) => ({
		id: item.id,
		product_name: item.product_name,
		follower: item.follower as string | null,
		handle: item.handle,
		cost: Number(item.cost)
	}));
}

/**
 * Retrieves the number of followers for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @returns {Promise<number>} - The number of followers.
 */
async function getCreatorFollowerCount(userid: number): Promise<number> {
	const followerCount = await db
		.select({
			follower_count: sql<number>`count(${follower_creator_table.follower_user_id})`.as(
				'follower_count'
			)
		})
		.from(follower_creator_table)
		.innerJoin(login_table, eq(login_table.id, follower_creator_table.creator_user_id))
		.where(eq(follower_creator_table.creator_user_id, userid));

	if (followerCount.length === 0) {
		return 0;
	} else {
		return Number(followerCount[0].follower_count);
	}
}

async function getFollowerNameList(creatorId: number): Promise<{ handle: string }[]> {
	const followers = await db
		.select({
			handle: login_table.handle
		})
		.from(follower_creator_table)
		.innerJoin(login_table, eq(login_table.id, follower_creator_table.creator_user_id))
		.where(eq(follower_creator_table.creator_user_id, creatorId));

	return !followers ? [] : followers;
}

async function getSubscriberNameList(creatorId: number): Promise<{ handle: string }[]> {
	const subscribers = await db
		.select({
			handle: login_table.handle
		})
		.from(plan_subscription_table)
		.innerJoin(login_table, eq(login_table.id, plan_subscription_table.follower_user_id))
		.where(eq(plan_subscription_table.creator_user_id, creatorId));
	return !subscribers ? [] : subscribers;
}

/**
 * returns the followers (from login table) of a creator
 *
 * @param userid
 *  @returns LoginQueryResult[]
 */
async function getCreatorFollowerList(userid: number): Promise<LoginQueryResult[]> {
	const followers = await db
		.select({
			id: login_table.id,
			handle: login_table.handle,
			email: login_table.email,
			firstName: login_table.first_name,
			lastName: login_table.last_name,
			profilePic: login_table.profile_pic
		})
		.from(login_table)
		.innerJoin(follower_creator_table, eq(login_table.id, follower_creator_table.follower_user_id))
		.where(eq(follower_creator_table.creator_user_id, userid));

	return followers;
}

async function getCreatorMissions(userid: number): Promise<DefaultMission[]> {
	const missions = await db
		.select({
			id: mission_table.id,
			name: mission_table.name,
			description: mission_table.description,
			platform: mission_table.platform,
			enabled: mission_creator_table.enabled
		})
		.from(mission_table)
		.innerJoin(mission_creator_table, eq(mission_table.id, mission_creator_table.mission_id))
		.where(
			and(
				eq(mission_creator_table.creator_user_id, userid),
				eq(mission_creator_table.enabled, true)
			)
		);

	for (const mission of missions) {
		const actions = await db
			.select()
			.from(mission_action_table)
			.where(
				and(
					eq(mission_action_table.mission_id, mission.id),
					eq(mission_action_table.creator_user_id, userid)
				)
			);
		mission.actions = actions;
	}
	return missions;
}

async function getMissionActionList(userid: number): Promise<MissionAction[]> {
	const actions = await db
		.select()
		.from(mission_action_table)
		.where(eq(mission_action_table.creator_user_id, userid))
		.orderBy(mission_action_table.name);

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
		.from(product_table)
		.where(and(eq(product_table.creator_user_id, userid), eq(product_table.enabled, true)));

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
	const followers = await getFollowerNameList(creatorUserId);
	const subscribers = await getSubscriberNameList(creatorUserId);
	const productCount = await getProductCount(creatorUserId);
	const products = await ProductService.getProductsByUserId(creatorUserId);
	const missions = await getCreatorMissions(creatorUserId);

	const revenue = await getMonthlyRevenue(creatorUserId);

	return (await {
		subscribers,
		followers,
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
