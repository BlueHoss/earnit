import db from '$lib/server/database/drizzle';
import { credit_transaction, follower_action } from '../database/schema';
import { and, eq, sql } from 'drizzle-orm';
import { TRANSACTION_TYPES } from '../services/credit.service.server';

/**
 * Determins if the creator has already received a reward for the follower action on the given date.
 * @param creatorUserId Earn It Creator user ID
 * @param followerUserId Earn It Follower user ID
 * @param missionActionId Earn It Mission Action ID
 * @param date the date you want to process
 * @returns the number of records inserted.
 */
async function pendingTransactionExists(
	creatorUserId: number,
	followerUserId: number,
	missionActionId: number,
	date: Date
): Promise<boolean> {
	const dayStart = new Date(date.setHours(0, 0, 0, 0)).toUTCString();
	const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toUTCString();

	const where = and(
		eq(credit_transaction.creator_user_id, creatorUserId),
		eq(credit_transaction.follower_user_id, followerUserId),
		eq(credit_transaction.mission_action_id, missionActionId),
		eq(credit_transaction.transaction_type, TRANSACTION_TYPES.Follower_Deposit),
		sql`${credit_transaction.date_transaction}::timestamp 
		BETWEEN ${dayStart}::timestamp 
		AND ${dayEnd}::timestamp`
	);

	const exists = await db
		.select({
			exists: sql<number>`1`
		})
		.from(credit_transaction)
		.where(where)
		.limit(1);

	return exists.length > 0;
}

export const CreditTransactionRepository = {
	pendingTransactionExists
};
