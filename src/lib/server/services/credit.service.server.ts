/**
 * Credit change when
 * 1: Follower performs an action. Credit is moved from Creator to Follower.
 * 2: Follower redeems a product. Credit is removed from follower and credit is 'used'. This is handled in the ProductService.
 * 3: Earn It gifts Creator credit. Credit is magically added to the Creator's account.
 * 4: Creator purchases credits via a plan.
 */

import { type EarnItActionResult, ActionResponse } from '$lib/utils/action-result';
import { and, desc, eq, sql } from 'drizzle-orm';
import db from '../database/drizzle';
import {
	credit_creator_pool_table,
	credit_follower_balance_table,
	credit_transaction_table,
	login_table,
	mission_action_table
} from '../database/schema';
import type { CreditDistributed } from '$lib/schema/credit.schema';

async function setFollowerCredit(
	credits: number,
	followerId: number,
	creatorId: number,
	missionActionId: number
): Promise<EarnItActionResult> {
	try {
		// Add Credit Transaction
		// Update Follower Credit Balance
		// Update Creator Credit Pool

		const missionActions = await db
			.select()
			.from(mission_action_table)
			.where(eq(mission_action_table.id, missionActionId));

		if (missionActions.length === 0) {
			return ActionResponse.fail('Mission action not found');
		}

		const missionAction = missionActions[0];

		//Get creator balance and make sure they can afford this transaction
		const creatorBalances = await db
			.select({
				available_credits: credit_creator_pool_table.available_credits
			})
			.from(credit_creator_pool_table)
			.where(eq(credit_creator_pool_table.creator_user_id, creatorId));

		if (creatorBalances.length === 0) {
			return ActionResponse.fail('Creator not found');
		}

		const creatorBalance = creatorBalances[0];

		if (credits > Number(creatorBalance.available_credits)) {
			return ActionResponse.fail('Creator does not have enough credits');
		}

		await db.transaction(async (tx) => {
			// 1. Add Credit Transaction
			await tx
				.insert(credit_transaction_table)
				.values({
					transaction_type: missionAction.name,
					creator_user_id: creatorId,
					follower_user_id: followerId,
					amount: credits,
					description: `Follower Action: ${missionAction.description}`
				})
				.returning();

			// 2. Update follower's credit balance
			await tx
				.update(credit_follower_balance_table)
				.set({
					credit_balance: sql`${credit_follower_balance_table.credit_balance} + ${credits}`
				})
				.where(
					and(
						eq(credit_follower_balance_table.follower_user_id, followerId),
						eq(credit_follower_balance_table.creator_user_id, creatorId)
					)
				)
				.returning();

			// 3. Update creators's credit balance
			await tx
				.update(credit_creator_pool_table)
				.set({
					total_credits: sql`${credit_creator_pool_table.total_credits} + ${credits}`,
					available_credits: sql`${credit_creator_pool_table.available_credits} - ${credits}`
				})
				.where(eq(credit_creator_pool_table.creator_user_id, creatorId))
				.returning();

			//4. Update creators credit balance on the login table
			await tx
				.update(login_table)
				.set({
					credit_balance: sql`${login_table.credit_balance} - ${credits}`
				})
				.where(eq(login_table.id, creatorId))
				.returning();

			// 3. Update creators's credit balance
			await tx
				.update(credit_creator_pool_table)
				.set({
					total_credits: sql`${credit_creator_pool_table.total_credits} + ${credits}`,
					available_credits: sql`${credit_creator_pool_table.available_credits} - ${credits}`
				})
				.where(eq(credit_creator_pool_table.creator_user_id, creatorId))
				.returning();

			//4. Update followers credit balance on the login table
			await tx
				.update(login_table)
				.set({
					credit_balance: sql`${login_table.credit_balance} + ${credits}`
				})
				.where(eq(login_table.id, followerId))
				.returning();
		});

		return ActionResponse.success('Credits applied successfully');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while rewarding the follower with points. Please try again later.'
		);
	}
}

async function setCreatorCredits(credits: number, creatorId: number): Promise<EarnItActionResult> {
	try {
		await db.transaction(async (tx) => {
			// 1. Update creators's credit balance
			await tx
				.update(credit_creator_pool_table)
				.set({
					available_credits: credits.toString()
				})
				.where(eq(credit_creator_pool_table.creator_user_id, creatorId))
				.returning();

			//2. Update creators credit balance on the login table
			await tx
				.update(login_table)
				.set({
					credit_balance: credits.toString()
				})
				.where(eq(login_table.id, creatorId))
				.returning();
		});

		return ActionResponse.success('Credits applied successfully');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while rewarding the follower with points. Please try again later.'
		);
	}
}

async function getCreditDistributionList(creatorId: number): Promise<CreditDistributed[]> {
	const creditDistributionList = await db
		.select({
			date: credit_transaction_table.date_transaction,
			amount: credit_transaction_table.amount,
			transaction_type: credit_transaction_table.transaction_type,
			to_user: login_table.handle
		})
		.from(credit_transaction_table)
		.innerJoin(login_table, eq(credit_transaction_table.creator_user_id, login_table.id))
		.where(eq(credit_transaction_table.creator_user_id, creatorId))
		.orderBy(desc(credit_transaction_table.date_transaction));

	return creditDistributionList;
}

export const CreditService = {
	setFollowerCredit,
	setCreatorCredits,
	getCreditDistributionList
};
