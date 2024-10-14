/**
 * Creator Profile Service
 *
 * Used to manage the creator profile.
 *
 */

import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { login } from '$lib/server/database/schema';
import { TextUtilities } from '$lib/utils/text-utilities';
import { ImageService } from './image.service.server';
import { type ProfileEditUser } from '$lib/schema/login.schema';

/**
 * Get the user bio
 *
 * @param {number} userid
 * @returns {Promise<any>}
 */
async function getUserBio(userid: number) {
	const bio = await db
		.select({
			bio: login.bio
		})
		.from(login)
		.where(eq(login.id, userid));
	return bio[0];
}

/**
 * Get the user profile
 *
 * @param {number} userid
 * @returns {Promise<any>}
 */
async function getUserProfile(userid: number): Promise<ProfileEditUser> {
	const bio = await db
		.select({
			id: login.id,
			handle: login.handle,
			title: login.title,
			email: login.email,
			bio: login.bio,
			first_name: login.first_name,
			last_name: login.last_name,
			receive_email: login.receive_email,
			profile_pic: login.profile_pic,
			social_media_profile: login.social_media_profile,
			tag_line: login.tag_line,
			is_creator: login.is_creator,
			is_follower: login.is_follower,
			reward_name: login.reward_name,
			store_name: login.store_name,
			category: login.category
		})
		.from(login)
		.where(eq(login.id, userid));
	return bio[0];
}

/**
 * Set the user profile
 *
 * @param {number} userid
 * @param {any} data
 * @returns {Promise<any>}
 */
async function setUserProfile(userid: number, data: ProfileEditUser) {
	//get the user profile and see if the profile pic is different, if so delete the old profile pic from storage
	removeOldProfilePic(userid, data.profile_pic);

	const result = await db
		.update(login)
		.set({
			first_name: data.first_name,
			last_name: data.last_name,
			bio: data.bio,
			date_updated: new Date(),
			title: data.title,
			tag_line: data.tag_line,
			handle: TextUtilities.removeAllSpaces(data.handle),
			receive_email: data.receive_email,
			profile_pic: data.profile_pic,
			social_media_profile: data.social_media_profile
		})
		.where(eq(login.id, userid));

	return result;
}

/**
 * Delete old user profile pic if new profile pic is different
 *
 * @param {number} userid
 * @param {string} newProfilePic
 * @returns {Promise<void>}
 */
async function removeOldProfilePic(userid: number, newProfilePic: string | null) {
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
			ImageService.deleteProfileImage(profilePicName, 'profile_image');
		}
	}
}

async function getAllCreators() {
	const creators = await db
		.select({
			id: login.id,
			profile_pic: login.profile_pic,
			store_name: login.store_name,
			title: login.title,
			handle: login.handle,
			category: login.category
		})
		.from(login)
		.where(eq(login.is_creator, true));

	return creators;
}

export const CreatorManagmentService = {
	setUserProfile,
	getUserBio,
	getUserProfile,
	getAllCreators
};
