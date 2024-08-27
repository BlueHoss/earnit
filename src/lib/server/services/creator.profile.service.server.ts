/**
 * Creator Profile Service
 *
 * Used to manage the creator profile.
 *
 */

// Libraries and modules
import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { login_table } from '$lib/server/database/schema';
import { TextUtilities } from '$lib/utils/text-utilities';
import { ImageService } from './image.service.server';

/**
 * Get the user bio
 *
 * @param {number} userid
 * @returns {Promise<any>}
 */
async function getUserBio(userid: number) {
	const bio = await db
		.select({
			bio: login_table.bio
		})
		.from(login_table)
		.where(eq(login_table.id, userid));
	return bio[0];
}

/**
 * Get the user profile
 *
 * @param {number} userid
 * @returns {Promise<any>}
 */
async function getUserProfile(userid: number) {
	const bio = await db
		.select({
			id: login_table.id,
			handle: login_table.handle,
			email: login_table.email,
			bio: login_table.bio,
			first_name: login_table.first_name,
			last_name: login_table.last_name,
			receive_email: login_table.receive_email,
			profile_pic: login_table.profile_pic,
			social_media_profile: login_table.social_media_profile,
			title: login_table.title,
			tag_line: login_table.tag_line
		})
		.from(login_table)
		.where(eq(login_table.id, userid));
	return bio[0];
}

/**
 * Set the user profile
 *
 * @param {number} userid
 * @param {any} data
 * @returns {Promise<any>}
 */
async function setUserProfile(userid: number, data) {
	//get the user profile and see if the profile pic is different, if so delete the old profile pic from storage
	removeOldProfilePic(userid, data.profile_pic);

	const result = await db
		.update(login_table)
		.set({
			first_name: data.first_name,
			last_name: data.last_name,
			bio: data.bio,
			date_updated: new Date(),
			title: data.title,
			tag_line: data.tag_line,
			handle: TextUtilities.removeAllSpaces(data.handle),
			receive_email: data.receive_email,
			profile_pic: data.profile_pic
		})
		.where(eq(login_table.id, userid));

	return result;
}

/**
 * Delete old user profile pic if new profile pic is different
 *
 * @param {number} userid
 * @param {string} newProfilePic
 * @returns {Promise<void>}
 */
async function removeOldProfilePic(userid: number, newProfilePic: string) {
	if (!newProfilePic) {
		return;
	}

	const userProfile = await getUserProfile(userid);

	if (!userProfile.profile_pic) {
		return;
	}

	if (userProfile.profile_pic !== newProfilePic) {
		const profilePicName = userProfile.profile_pic.split('/').pop();
		if (profilePicName) {
			ImageService.deleteProfileImage(profilePicName);
		}
	}
}

export const CreatorProfileService = {
	setUserProfile,
	getUserBio,
	getUserProfile
};
