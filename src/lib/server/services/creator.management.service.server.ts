/**
 * Creator Profile Service
 *
 * Used to manage the creator profile.
 *
 */

// Libraries and modules
import { and, eq, isNull } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	follower_creator_table,
	login_table,
	plan_subscription_table
} from '$lib/server/database/schema';
import { TextUtilities } from '$lib/utils/text-utilities';
import { ImageService } from './image.service.server';
import { creatorScheam, type Creator, type ProfileEditUser } from '$lib/schema/login.schema';
import {} from 'moment';
import { ActionResponse, type EarnItActionResult } from '$lib/utils/action-result';

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
async function getUserProfile(userid: number): Promise<ProfileEditUser> {
	const bio = await db
		.select({
			id: login_table.id,
			handle: login_table.handle,
			title: login_table.title,
			email: login_table.email,
			bio: login_table.bio,
			first_name: login_table.first_name,
			last_name: login_table.last_name,
			receive_email: login_table.receive_email,
			profile_pic: login_table.profile_pic,
			social_media_profile: login_table.social_media_profile,
			tag_line: login_table.tag_line,
			is_creator: login_table.is_creator,
			is_follower: login_table.is_follower,
			reward_name: login_table.reward_name,
			store_name: login_table.store_name,
			credit_balance: login_table.credit_balance,
			category: login_table.category
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
async function setUserProfile(userid: number, data: ProfileEditUser) {
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

async function addFollower(creatorId: number, followerId: number): Promise<EarnItActionResult> {
	if (creatorId === followerId) {
		return ActionResponse.fail('You cannot follow yourself.');
	}

	//Ensure follower is not already following
	const isFollowing = await db
		.select({
			id: follower_creator_table.follower_user_id
		})
		.from(follower_creator_table)
		.where(
			and(
				eq(follower_creator_table.creator_user_id, creatorId),
				eq(follower_creator_table.follower_user_id, followerId)
			)
		);

	if (isFollowing.length > 0) {
		return ActionResponse.fail('You are already following this user.');
	}
	const result = await db
		.insert(follower_creator_table)
		.values({
			creator_user_id: creatorId,
			follower_user_id: followerId
		})
		.returning();

	return result
		? ActionResponse.success('You are following!')
		: ActionResponse.fail('There was an error following this user.');
}

async function removeFollower(creatorId: number, followerId: number): Promise<EarnItActionResult> {
	const result = await db
		.delete(follower_creator_table)
		.where(
			and(
				eq(follower_creator_table.creator_user_id, creatorId),
				eq(follower_creator_table.follower_user_id, followerId)
			)
		)
		.returning();

	return !result || result.length <= 0
		? ActionResponse.fail('Following this user failed')
		: ActionResponse.success('Follow success!');
}

async function getCreatorWithFollowers(creatorId: number): Promise<Creator | null> {
	const creator = await db
		.select({
			id: login_table.id,
			handle: login_table.handle,
			title: login_table.title,
			email: login_table.email,
			bio: login_table.bio,
			first_name: login_table.first_name,
			last_name: login_table.last_name,
			profile_pic: login_table.profile_pic,
			social_media_profile: login_table.social_media_profile,
			tag_line: login_table.tag_line,
			is_creator: login_table.is_creator,
			is_follower: login_table.is_follower,
			store_name: login_table.store_name,
			reward_name: login_table.reward_name,
			credit_balance: login_table.credit_balance,
			category: login_table.category
		})
		.from(login_table)
		.where(eq(login_table.id, creatorId));

	let parsedCreator = null;

	try {
		parsedCreator = creatorScheam.parse(creator[0]);
	} catch (error) {
		console.error('Error parsing creator', error);
	}

	if (parsedCreator) {
		parsedCreator.subscribers = await getSubscribers(creatorId);
		parsedCreator.followers = await getFollowers(creatorId);
	}

	return parsedCreator;
}

async function getFollowers(creatorId: number): Promise<{ id: number | null }[]> {
	const followers = await db
		.select({
			id: follower_creator_table.follower_user_id
		})
		.from(follower_creator_table)
		.where(eq(follower_creator_table.creator_user_id, creatorId));

	return !followers ? [] : followers;
}

async function getSubscribers(creatorId: number): Promise<{ id: number | null }[]> {
	const subscribers = await db
		.select({
			id: plan_subscription_table.follower_user_id
		})
		.from(plan_subscription_table)
		.where(
			and(
				eq(plan_subscription_table.creator_user_id, creatorId),
				isNull(plan_subscription_table.date_canceled)
			)
		);
	return !subscribers ? [] : subscribers;
}

async function getAllCreators() {
	const creators = await db
		.select({
			id: login_table.id,
			profile_pic: login_table.profile_pic,
			store_name: login_table.store_name,
			title: login_table.title,
			handle: login_table.handle,
			category: login_table.category
		})
		.from(login_table)
		.where(eq(login_table.is_creator, true));

	return creators;
}

export const CreatorManagmentService = {
	setUserProfile,
	getUserBio,
	getUserProfile,
	addFollower,
	removeFollower,
	getCreatorWithFollowers,
	getAllCreators
};
