import { baseUserModifedSchema } from '$lib/schema/login.schema';
import { eq, sql } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	credit_creator_balance,
	earnit_scanner_creator,
	login,
	plan_subscription
} from '../database/schema';
import { z } from 'zod';

export type Creator = z.infer<typeof userSchema>;

export const userSchema = baseUserModifedSchema
	.partial()
	.omit({
		token: true,
		hashed_password: true
	})
	.extend({
		plan_subscription_id: z.number(),
		credit_balance: z.number()
	});

/**
 * Get creator id by scanner id. Scanner is the tool created by the outsouce group.
 * @param scannerCreatorId this is from the public_profile table
 * @returns
 */
async function getCreatorIDByScannerId(scannerCreatorId: number): Promise<number | null> {
	const where = eq(earnit_scanner_creator.scanner_creator_id, scannerCreatorId);

	const followers = await db.select().from(earnit_scanner_creator).where(where);

	return followers.length > 0 ? followers[0].creator_user_id : null;
}

/**
 * Maps an Earn It creator to the scanner creator table (public_profile)
 * @param scannerCreatorID
 * @param creatorUserId
 * @returns
 *
 * */
async function mapEarnItScanCreator(scannerCreatorID: number, creatorUserId: number) {
	const newFollower = await db
		.insert(earnit_scanner_creator)
		.values({
			scanner_creator_id: scannerCreatorID,
			creator_user_id: creatorUserId,
			date_added: new Date().toUTCString()
		})
		.returning();

	return newFollower.length > 0 ? newFollower[0] : null;
}

async function getCreatorsWithSubscriptions(): Promise<Creator[]> {
	const creatorsWithSubs = await db
		.select({
			id: login.id,
			first_name: login.first_name,
			last_name: login.last_name,
			email: login.email,
			plan_subscription_id: plan_subscription.id,
			credit_balance: sql<number>`COALESCE(${credit_creator_balance.credit_balance}, 0)`.as(
				'credit_balance'
			)
		})
		.from(login)
		.innerJoin(plan_subscription, eq(plan_subscription.creator_user_id, login.id))
		.innerJoin(credit_creator_balance, eq(credit_creator_balance.creator_user_id, login.id))
		.where(eq(login.is_creator, true));

	return creatorsWithSubs;
}

export const CreatorRepository = {
	getCreatorsWithSubscriptions,
	getCreatorIDByScannerId,
	mapEarnItScanCreator
};
