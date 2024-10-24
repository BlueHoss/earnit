import db from '$lib/server/database/drizzle';
import { follower_action } from '../database/schema';
import type { FollowerAction, FollowerActionInsert } from '$lib/schema/follower_action.schema';
import { and, eq, sql } from 'drizzle-orm';

/**
 * Inserts a new pending follower action.
 * @param followerAction
 * @returns the number of records inserted.
 */
async function insertFollowerAction(followerAction: FollowerActionInsert): Promise<number | null> {
	const newFollowerAction = await db.insert(follower_action).values(followerAction).returning();
	return newFollowerAction.length;
}

export const FOLLOWER_ACTION_STATUS = {
	Pending: 'Pending',
	Failed: 'Failed'
} as const;

/**
 *  The purpose is to prevent the same action from being rewarded multiple times in a day.
 * @param creatorId
 * @param followerId
 * @param missionActionId
 * @param date
 * @returns a unique list of actions by follower, creator, action and date.
 */
async function getFollowerActions(date: Date): Promise<FollowerAction[]> {
	//This might mess up the date/time that followers can earn rewards.
	const dayStart = new Date(date.setHours(0, 0, 0, 0)).toUTCString();
	const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toUTCString();

	const where = and(
		eq(follower_action.status, FOLLOWER_ACTION_STATUS.Pending),
		sql`${follower_action.date_added}::timestamp BETWEEN ${dayStart}::timestamp AND ${dayEnd}::timestamp`
	);

	return (await db
		.select({
			creator_user_id: follower_action.creator_user_id,
			follower_user_id: follower_action.follower_user_id,
			mission_action_id: follower_action.mission_action_id,
			status: follower_action.status,
			credits: follower_action.credits
		})
		.from(follower_action)
		.where(where)
		.groupBy(
			follower_action.creator_user_id,
			follower_action.follower_user_id,
			follower_action.mission_action_id,
			follower_action.status,
			follower_action.credits
		)) as FollowerAction[];
}

async function deleteProcessedAction(followerAction: FollowerAction) {
	const where = and(
		eq(follower_action.creator_user_id, followerAction.creator_user_id),
		eq(follower_action.follower_user_id, followerAction.follower_user_id),
		eq(follower_action.mission_action_id, followerAction.mission_action_id)
	);

	await db.delete(follower_action).where(where);
}

async function updateAction(followerAction: FollowerAction) {
	const where = and(
		eq(follower_action.creator_user_id, followerAction.creator_user_id),
		eq(follower_action.follower_user_id, followerAction.follower_user_id),
		eq(follower_action.mission_action_id, followerAction.mission_action_id)
	);

	await db.update(follower_action).set(followerAction).where(where);
}

export const FollowerActionRepository = {
	insertFollowerAction,
	getFollowerActions,
	deleteProcessedAction,
	updateAction
};
