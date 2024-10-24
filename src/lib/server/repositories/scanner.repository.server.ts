/**
 * Handle all of the logic for the database of the scanner repository.
 */

import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	post,
	public_profile,
	public_profile_post_mm,
	public_profile_post_mm_post,
	user_to_check
} from '../database/schema';
import type { PublicProfile } from '$lib/schema/scanner/publicProfile.schema';

async function getUserToCheck(user_to_check_id: number) {
	const where = eq(user_to_check.id, user_to_check_id);
	const users = await db.select().from(user_to_check).where(where);
	return users.length > 0 ? users[0] : null;
}

async function getPostById(postId: number) {
	const where = eq(post.id, postId);
	const posts = await db.select().from(post).where(where);
	return posts.length > 0 ? posts[0] : null;
}

async function getScanCreatorByPost(postId: number): Promise<PublicProfile | null> {
	//Fetch creator from public_profile_post_mm
	const wherePostID = eq(public_profile_post_mm_post.post_id, postId);
	const public_profile_post_mm_postRecs = await db
		.select()
		.from(public_profile_post_mm_post)
		.where(wherePostID);

	if (public_profile_post_mm_postRecs.length === 0) {
		return null;
	}

	const whereProfileID = eq(
		public_profile_post_mm.id,
		public_profile_post_mm_postRecs[0].publicprofilepostmm_id
	);
	const public_profile_post_mmRecs = await db
		.select()
		.from(public_profile_post_mm)
		.where(whereProfileID);

	if (public_profile_post_mmRecs.length === 0) {
		return null;
	}

	const wherePublicProfile = eq(public_profile.id, public_profile_post_mmRecs[0].public_profile_id);
	const public_profileRecs = await db.select().from(public_profile).where(wherePublicProfile);

	return public_profileRecs.length > 0 ? public_profileRecs[0] : null;
}

async function getScanCreatorById(public_profile_id: number) {
	const where = eq(public_profile.id, public_profile_id);
	const public_profileRecs = await db.select().from(public_profile).where(where);

	return public_profileRecs.length > 0 ? public_profileRecs[0] : null;
}

async function getScanCreatorBySocialMediaProfile(socialMediaProfile: string) {
	const where = eq(public_profile.username, socialMediaProfile);
	const public_profileRecs = await db.select().from(public_profile).where(where);

	return public_profileRecs.length > 0 ? public_profileRecs[0] : null;
}

export const ScannerRepository = {
	getUserToCheck,
	getPostById,
	getScanCreatorByPost,
	getScanCreatorById,
	getScanCreatorBySocialMediaProfile
};
