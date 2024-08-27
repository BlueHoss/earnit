import { eq, and, sql, sum, between } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	login_table,
	plan_subscription_table,
	plan_table,
	product_invoice_table,
	product_table,
	reward_earned_table,
	store_table
} from '$lib/server/database/schema';
import type { ProductPurchase } from '$lib/types';
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
	const count = await db
		.select({
			total: sum(reward_earned_table.reward_value)
		})
		.from(reward_earned_table)
		.where(
			and(
				eq(reward_earned_table.creator_user_id, userid),
				between(reward_earned_table.date_awarded, startDate, endDate)
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
async function getProductsPurchasedCount(userid: number, startDate: Date, endDate: Date) {
	const count = await db
		.select({
			count: sql<number>`count(*) as integer`
		})
		.from(product_invoice_table)
		.where(
			and(
				eq(product_invoice_table.creator_user_id, userid),
				between(product_invoice_table.date_purchased, startDate, endDate)
			)
		);

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
	const count = await db
		.select({
			total: sum(product_invoice_table.cost)
		})
		.from(product_invoice_table)
		.where(
			and(
				eq(product_invoice_table.creator_user_id, userid),
				between(product_invoice_table.date_purchased, startDate, endDate)
			)
		);

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
): Promise<ProductPurchase[]> {
	const list = await db
		.select({
			id: product_table.id,
			name: product_table.name,
			follower: sql`${login_table.first_name} || ' ' || ${login_table.last_name}`.as('follower'),
			handle: login_table.handle,
			cost: product_invoice_table.cost
		})
		.from(store_table)
		.innerJoin(product_table, eq(store_table.id, product_table.store_id))
		.innerJoin(product_invoice_table, eq(product_table.id, product_invoice_table.product_id))
		.innerJoin(login_table, eq(product_invoice_table.follower_user_id, login_table.id))
		.where(
			and(
				eq(product_invoice_table.creator_user_id, userid),
				between(product_invoice_table.date_purchased, startDate, endDate)
			)
		);

	// Transform the query result to match ProductPurchase interface
	const transformedList: ProductPurchase[] = list.map((item) => ({
		id: item.id,
		name: item.name ?? '', // Convert null to empty string
		follower: item.follower as string, // Assert follower as string
		handle: item.handle,
		cost: Number(item.cost) || 0 // Convert to number, use 0 if null or NaN
	}));

	return transformedList;
}

export const CreatorDashboardService = {
	getPaidSubscribers,
	getMonthlyRevenue,
	getRewardsUsed,
	getProductsPurchasedCount,
	getProductsPurchasedAmount,
	getProductsPurchasedList
};
