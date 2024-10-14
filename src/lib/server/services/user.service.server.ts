import { TextUtilities } from '$lib/utils/text-utilities.js';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET,
	PUBLIC_DEFAULT_PROFILE_IMAGE
} from '$env/static/public';
import { type BaseUser, type BaseUserUpdate, type SignupUser } from '$lib/schema/login.schema';
import { Argon2id } from 'oslo/password';
import { eq, sql } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	credit_creator_balance,
	credit_follower_balance,
	login,
	mission_action,
	mission_creator,
	mission_default_action,
	mission
} from '$lib/server/database/schema';
import type { User } from 'lucia';

/**
 * Function to create a new user with default values
 * @param signupSchema
 * @returns	BaseUser | null
 */
async function createNewUser(signupSchema: SignupUser): Promise<BaseUser | null> {
	const newUser = await transformSignupToUser(signupSchema);
	return await createUser(newUser);
}

/**
 *  Utility function to transform signup data to full user data
 * @param signupData
 * @returns BaseUser
 */
async function transformSignupToUser(signupData: SignupUser): Promise<BaseUser> {
	const { ...userData } = signupData;
	if (userData.is_creator) {
		return {
			...userData,
			handle: createHandle(signupData.first_name, signupData.last_name),
			hashed_password: await new Argon2id().hash(signupData.password),
			title: "Earn It's Newest Creator",
			profile_pic: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET}/${PUBLIC_DEFAULT_PROFILE_IMAGE}`,
			tag_line: 'Selling digital products is my jam!',
			bio: 'Say hi. I am new here!',
			token: crypto.randomUUID(),
			date_created: new Date(),
			date_updated: new Date(),
			store_name: `${signupData.first_name}'s Store`,
			reward_name: `${signupData.first_name} Credit`,
			category: 'General'
		};
	} else {
		return {
			...userData,
			handle: createHandle(signupData.first_name, signupData.last_name),
			hashed_password: await new Argon2id().hash(signupData.password),
			title: "Earn It's Newest Earner",
			profile_pic: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET}/defaultuser.png`,
			token: crypto.randomUUID(),
			date_created: new Date(),
			date_updated: new Date()
		};
	}
}

async function addDefaultMissionToNewUser(creatorId: number) {
	const missions = await db.select().from(mission);

	//Give the new creator all the missions
	for (const mission of missions) {
		const new_mission_creator = {
			mission_id: mission.id,
			creator_user_id: creatorId
		};
		await db.insert(mission_creator).values(new_mission_creator);

		//Give the new creator all the mission default actions
		const defaultActions = await db
			.select()
			.from(mission_default_action)
			.where(eq(mission_default_action.mission_id, mission.id));

		for (const action of defaultActions) {
			action.creator_user_id = creatorId;
			delete action.id;
			await db.insert(mission_action).values(action);
		}
	}
}

/**
 * Function to create a Handle from first and last name
 * @param firstName
 * @param lastName
 * @returns string
 */
function createHandle(firstName: string, lastName: string): string {
	return TextUtilities.removeAllSpaces(`${firstName.toLowerCase()}${lastName.toLowerCase()}`);
}

/**
 * Get a user by email
 * @param email
 * @returns BaseUser | null
 */
async function getUserByEmail(email: string): Promise<BaseUser | null> {
	const user = await db
		.select()
		.from(login)
		.where(eq(TextUtilities.lower(login.email), email.toLowerCase()));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
}

/**
 * Get a user by ID
 * @param userId
 * @returns BaseUser | null
 */
async function getUserByUserId(userId: number): Promise<BaseUser | null> {
	const user = await db
		.select({
			id: login.id,
			handle: login.handle,
			first_name: login.first_name,
			last_name: login.last_name,
			email: login.email,
			verified: login.verified,
			is_creator: login.is_creator,
			is_follower: login.is_follower,
			provider: login.provider,
			provider_id: login.provider_id,
			profile_pic: login.profile_pic,
			social_media_profile: login.social_media_profile,
			follower_count: login.follower_count,
			title: login.title,
			tag_line: login.tag_line,
			bio: login.bio,
			terms: login.terms,
			receive_email: login.receive_email,
			date_created: login.date_created,
			date_updated: login.date_updated,
			store_name: login.store_name,
			reward_name: login.reward_name,
			category: login.category
		})
		.from(login)
		.where(eq(login.id, userId));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
}

/**
 * Get a user by token
 * @param token
 * @returns BaseUser | null
 */
async function getUserByToken(token: string): Promise<BaseUser | null> {
	const user = await db.select().from(login).where(eq(login.token, token));

	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
}

/**
 * Update a user
 * @param id
 * @param user
 * @returns BaseUser | null
 */
async function updateUser(id: number, user: BaseUserUpdate): Promise<BaseUser | null> {
	const result = await db.update(login).set(user).where(eq(login.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

/**
 * Create a user
 * @param user
 * @returns BaseUser | null
 */
async function createUser(user: BaseUser): Promise<BaseUser | null> {
	//remove ID so the db creates a serial,identity or autoincrement.
	//const { id: _, ...newUser } = user;

	const result: BaseUser[] = await db.insert(login).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		postNewUserTasks(result[0]);
		return result[0];
	}
}

async function addInitialCreditstoCreator(creatorId: number, initialCredit: number) {
	const existingCreditRecord = await db
		.select()
		.from(credit_creator_balance)
		.where(eq(credit_creator_balance.creator_user_id, creatorId));
	if (existingCreditRecord.length > 0) {
		const creditRecord = existingCreditRecord[0];
		creditRecord.credits_received += initialCredit;
		creditRecord.date_updated = new Date();
		await db
			.update(credit_creator_balance)
			.set(creditRecord)
			.where(eq(credit_creator_balance.id, creditRecord.id));
	} else {
		const credit = {
			creator_user_id: creatorId,
			date_updated: new Date(),
			credits_received: initialCredit.toString(),
			credits_awarded: '0.00'
		};
		await db.insert(credit_creator_balance).values(credit);
	}
}

function postNewUserTasks(newUser: BaseUser) {
	if (newUser.is_creator) {
		addDefaultMissionToNewUser(Number(newUser.id));
		addInitialCreditstoCreator(Number(newUser.id), 50000);
	}
}

async function getSessioUser(userId: number): Promise<User | null> {
	const user = await db
		.select({
			userId: login.id,
			id: login.id,
			provider: login.provider,
			providerId: login.provider_id,
			email: login.email,
			handle: login.handle,
			first_name: login.first_name,
			last_name: login.last_name,
			role: login.role,
			verified: login.verified,
			token: login.token,
			is_creator: login.is_creator,
			is_follower: login.is_follower,
			follower_count: login.follower_count,
			profile_pic: login.profile_pic,
			title: login.title,
			tag_line: login.tag_line,
			store_name: login.store_name,
			reward_name: login.reward_name,
			social_media_profile: login.social_media_profile,
			stripe_customer_id: login.stripe_customer_id,
			credit_balance: sql<number>`
					CASE
					WHEN ${login.is_creator} THEN (
						SELECT SUM(${credit_creator_balance.credit_balance})
						FROM ${credit_creator_balance}
						WHERE ${credit_creator_balance.creator_user_id} = ${userId}
					)
					WHEN ${login.is_follower} THEN (
						SELECT SUM(${credit_follower_balance.credit_balance})
						FROM ${credit_follower_balance}
						WHERE ${credit_follower_balance.follower_user_id} = ${userId}
					)
					ELSE 0
					END
				`.as('credit_balance'),

			user_type: sql<string>`
				CASE
				WHEN ${login.is_creator} AND ${login.is_follower} THEN 'creator'
				WHEN ${login.is_creator} THEN 'creator'
				WHEN ${login.is_follower} THEN 'follower'
				ELSE 'public'
				END
			`.as('user_type'),
			initials: sql<string>`
				CONCAT(
					UPPER(LEFT(${login.first_name}, 1)),
					UPPER(LEFT(COALESCE(${login.last_name}, ''), 1))
				)
			`.as('initials')
		})
		.from(login)
		.where(eq(login.id, userId));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
}

export const UserService = {
	createNewUser,
	updateUser,
	getUserByToken,
	getUserByEmail,
	getUserByUserId,
	getSessioUser
};
