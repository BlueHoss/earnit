import { eq, and, sql, sum, between, type SQL } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	follower_creator_table,
	login_table,
	plan_subscription_table,
	plan_table,
	product_invoice_table,
	product_table,
	reward_earned_table,
	store_table
} from '$lib/server/database/schema';
import type { LoginQueryResult } from '$lib/schema/login.schema';
import type { ProductInvoiceResult } from '$lib/schema/product_invoice.schema';
//import type { User, UpdateUser } from '$lib/server/database/drizzle-schemas';

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
				eq(plan_subscription_table.active, true),
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
}

/**
 * Retrieves the rewards used for a given Creator.
 *
 * @param {number} userid - The ID of the user.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Promise<number>} - The rewards used.
 */
async function getRewardsUsed(userid: number, startDate: Date, endDate: Date) {
	let whereClause: SQL<unknown> | undefined = eq(reward_earned_table.creator_user_id, userid);

	if (startDate !== null && endDate !== null) {
		whereClause = and(whereClause, between(reward_earned_table.date_awarded, startDate, endDate));
	}
	const count = await db
		.select({
			total: sum(reward_earned_table.reward_value)
		})
		.from(reward_earned_table)
		.where(whereClause);

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
		.from(store_table)
		.innerJoin(product_table, eq(store_table.id, product_table.store_id))
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
		.innerJoin(store_table, eq(store_table.id, product_table.store_id))
		.where(and(eq(store_table.creator_user_id, userid), eq(product_table.enabled, true)));

	if (productCount.length === 0) {
		return 0;
	} else {
		return Number(productCount[0].count);
	}
}

export const CreatorDashboardService = {
	getPaidSubscribers,
	getMonthlyRevenue,
	getRewardsUsed,
	getProductsPurchasedCount,
	getProductsPurchasedAmount,
	getProductsPurchasedList,
	getCreatorFollowerCount,
	getCreatorFollowerList,
	getProductCount
};
