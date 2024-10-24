import {
	type DistributionStatus,
	type RewardDistribution
} from '$lib/schema/credit_follower_distribution.schema';
import { eq, sql } from 'drizzle-orm';
import { credit_follower_distribution } from '../database/schema';
import db from '$lib/server/database/drizzle';

async function getLastRunDate(): Promise<Date> {
	const lastRun = await db
		.select({
			date_ran: sql<Date>`MAX(${credit_follower_distribution.date_ran})`
		})
		.from(credit_follower_distribution);

	if (lastRun.length > 0) {
		return lastRun[0].date_ran ?? new Date();
	} else {
		return new Date();
	}
}

async function createNewDistrubtion(date: Date): Promise<RewardDistribution | null> {
	const newDistribution = await db
		.insert(credit_follower_distribution)
		.values({
			date_ran: date.toUTCString(),
			status: 'pending'
		})
		.returning();

	return newDistribution.length > 0 ? newDistribution[0] : null;
}

async function updateDistributionStatus(
	distributionId: number,
	status: DistributionStatus,
	actionsProcessed: number
) {
	const updatedDistribution = await db
		.update(credit_follower_distribution)
		.set({
			status,
			actions_processed: actionsProcessed
		})
		.where(eq(credit_follower_distribution.id, distributionId))
		.returning();

	return updatedDistribution.length > 0 ? updatedDistribution[0] : null;
}

export const RewardDistrubutionRepository = {
	createNewDistrubtion,
	updateDistributionStatus,
	getLastRunDate
};
