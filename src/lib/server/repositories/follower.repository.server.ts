import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { earnit_scanner_follower } from '../database/schema';

/**
 * Get follower id by scanner id. Scanner is the tool created by the outsouce group.
 * @param scannerFollowerId
 * @returns
 */
async function getFollowerIDByScannerId(scannerFollowerId: number): Promise<number | null> {
	const where = eq(earnit_scanner_follower.scanner_follower_id, scannerFollowerId);
	const followers = await db.select().from(earnit_scanner_follower).where(where);

	return followers.length > 0 ? followers[0].follower_user_id : null;
}

/**
 * Maps an Earn It follower to the scanner follower table (user_to_check)
 * @param scannerFollowerID
 * @param loginId
 * @returns
 *
 * */
async function mapEarnItScanFollower(scannerFollowerID: number, loginId: number) {
	const newFollower = await db
		.insert(earnit_scanner_follower)
		.values({
			scanner_follower_id: scannerFollowerID,
			follower_user_id: loginId,
			date_added: new Date().toUTCString()
		})
		.returning();

	return newFollower.length > 0 ? newFollower[0] : null;
}

export const FollowerRepository = {
	getFollowerIDByScannerId,
	mapEarnItScanFollower
};
