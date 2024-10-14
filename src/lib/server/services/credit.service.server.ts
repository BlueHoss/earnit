/**
 * Credit change when
 * 1: Follower performs an action. Credit is moved from Creator to Follower.
 * 2: Follower redeems a product. Credit is removed from follower and credit is 'used'. This is handled in the ProductService.
 * 3: Earn It gifts Creator credit. Credit is magically added to the Creator's account.
 * 4: Creator purchases credits via a plan.
 */

import { type EarnItActionResult, ActionResponse } from '$lib/utils/action-result';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import db from '../database/drizzle';
import {
	credit_creator_balance,
	credit_distribution,
	credit_follower_balance,
	credit_transaction,
	login,
	mission_action
} from '../database/schema';
import type { CreditDistributed } from '$lib/schema/credit.schema';

async function makeFollowerDeposit(
	creatorId: number,
	followerId: number,
	credits: number,
	missionActionId: number
): Promise<EarnItActionResult> {
	const TRANSACTION_TYPE = 'Follower_Deposit';
	try {
		// Add Credit Transaction
		// Update Follower Balance
		// Update Creator Balance

		const missionActions = await db
			.select()
			.from(mission_action)
			.where(eq(mission_action.id, missionActionId));

		if (missionActions.length === 0) {
			return ActionResponse.fail('Mission action not found');
		}

		const missionAction = missionActions[0];

		//Get creator balance and make sure they can afford this transaction
		const creatorBalances = await db
			.select({
				available_credits: credit_creator_balance.credit_balance
			})
			.from(credit_creator_balance)
			.where(eq(credit_creator_balance.creator_user_id, creatorId));

		if (creatorBalances.length === 0) {
			return ActionResponse.fail('Creator does not have enough credits.');
		}

		const creatorBalance = creatorBalances[0];

		if (credits > Number(creatorBalance.available_credits)) {
			return ActionResponse.fail('Creator does not have enough credits.');
		}

		await db.transaction(async (tx) => {
			// 1. Add Credit Transaction
			await tx
				.insert(credit_transaction)
				.values({
					transaction_type: TRANSACTION_TYPE,
					creator_user_id: creatorId,
					follower_user_id: followerId,
					amount: credits,
					description: `${missionAction.name}: ${missionAction.description}`
				})
				.returning();

			// 2. Update follower's credit balance
			const followerUpdate = await tx
				.update(credit_follower_balance)
				.set({
					credit_balance: sql`${credit_follower_balance.credit_balance} + ${credits}`
				})
				.where(
					and(
						eq(credit_follower_balance.follower_user_id, followerId),
						eq(credit_follower_balance.creator_user_id, creatorId)
					)
				)
				.returning();

			if (followerUpdate.length === 0) {
				await tx.insert(credit_follower_balance).values({
					follower_user_id: followerId,
					creator_user_id: creatorId,
					credit_balance: credits,
					date_updated: new Date()
				});
			}

			// 3. Update creators's credit balance
			await tx
				.update(credit_creator_balance)
				.set({
					credits_awarded: sql`${credit_creator_balance.credits_awarded} + ${credits}`,
					credit_balance: sql`${credit_creator_balance.credit_balance} - ${credits}`
				})
				.where(eq(credit_creator_balance.creator_user_id, creatorId))
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

async function makeCreatorDeposit(
	earnItCreatorId: number,
	creatorId: number,
	amount: number
): Promise<EarnItActionResult> {
	try {
		//This is the Earn It creators account (at least at the time of writing this 9/20/24)
		const creatorBalances = await db
			.select({
				available_credits: credit_creator_balance.credit_balance
			})
			.from(credit_creator_balance)
			.where(eq(credit_creator_balance.creator_user_id, earnItCreatorId));

		if (creatorBalances.length === 0) {
			return ActionResponse.fail('Earn It Creator does not have enough credits (Wrong creator?).');
		}

		const creatorBalance = creatorBalances[0];

		if (amount > Number(creatorBalance.available_credits)) {
			return ActionResponse.fail('Creator does not have enough credits.');
		}

		await db.transaction(async (tx) => {
			// 1. record the credit distribution
			await tx
				.insert(credit_distribution)
				.values({
					earnit_creator_user_id: earnItCreatorId,
					creator_user_id: creatorId,
					amount: amount,
					date_transaction: new Date()
				})
				.returning();

			// 1. Update Earn It creators's credit balance
			await tx
				.update(credit_creator_balance)
				.set({
					credits_awarded: amount.toString()
				})
				.where(eq(credit_creator_balance.creator_user_id, earnItCreatorId))
				.returning();

			// 3. Update creators's credit balance
			await tx
				.update(credit_creator_balance)
				.set({
					credits_awarded: sql`${credit_creator_balance.credits_received} + ${amount}`,
					credit_balance: sql`${credit_creator_balance.credit_balance} + ${amount}`
				})
				.where(eq(credit_creator_balance.creator_user_id, creatorId))
				.returning();
		});

		return ActionResponse.success('Credits applied to Creator successfully');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while running a Creator Distribution Please try again later.'
		);
	}
}

async function getCreditDistributionList(creatorId: number): Promise<CreditDistributed[]> {
	//We do not include Product Redemption in this list
	const creditDistributionList = await db
		.select({
			date: credit_transaction.date_transaction,
			amount: credit_transaction.amount,
			transaction_type: credit_transaction.transaction_type,
			to_user: login.handle
		})
		.from(credit_transaction)
		.innerJoin(login, eq(credit_transaction.creator_user_id, login.id))
		.where(
			and(
				eq(credit_transaction.creator_user_id, creatorId),
				ne(credit_transaction.transaction_type, 'Product_Redemption')
			)
		)
		.orderBy(desc(credit_transaction.date_transaction));

	return creditDistributionList;
}

export const CreditService = {
	makeFollowerDeposit,
	makeCreatorDeposit,
	getCreditDistributionList
};
