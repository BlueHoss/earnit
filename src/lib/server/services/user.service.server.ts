import { TextUtilities } from '$lib/utils/text-utilities.js';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET,
	PUBLIC_DEFAULT_PROFILE_IMAGE
} from '$env/static/public';
import { type BaseUser, type BaseUserUpdate, type SignupUser } from '$lib/schema/login.schema';
import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import {
	login_table,
	mission_action_table,
	mission_creator_table,
	mission_default_action_table,
	mission_table
} from '$lib/server/database/schema';

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
			reward_name: `${signupData.first_name} Credit`
		};
	} else {
		return {
			...userData,
			handle: createHandle(signupData.first_name, signupData.last_name),
			hashed_password: await new Argon2id().hash(signupData.password),
			title: "Earn It's Newest Follower",
			profile_pic: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET}/defaultuser.png`,
			token: crypto.randomUUID(),
			date_created: new Date(),
			date_updated: new Date()
		};
	}
}

async function addDefaultMissionToNewUser(creatorId: number) {
	const missions = await db.select().from(mission_table);

	//Give the new creator all the missions
	for (const mission of missions) {
		const mission_creator = {
			mission_id: mission.id,
			creator_user_id: creatorId
		};
		await db.insert(mission_creator_table).values(mission_creator);

		//Give the new creator all the mission default actions
		const defaultActions = await db
			.select()
			.from(mission_default_action_table)
			.where(eq(mission_default_action_table.mission_id, mission.id));

		for (const action of defaultActions) {
			action.creator_user_id = creatorId;
			delete action.id;
			await db.insert(mission_action_table).values(action);
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
		.from(login_table)
		.where(eq(TextUtilities.lower(login_table.email), email.toLowerCase()));
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
			id: login_table.id,
			handle: login_table.handle,
			first_name: login_table.first_name,
			last_name: login_table.last_name,
			email: login_table.email,
			verified: login_table.verified,
			is_creator: login_table.is_creator,
			is_follower: login_table.is_follower,
			provider: login_table.provider,
			provider_id: login_table.provider_id,
			profile_pic: login_table.profile_pic,
			social_media_profile: login_table.social_media_profile,
			follower_count: login_table.follower_count,
			title: login_table.title,
			tag_line: login_table.tag_line,
			bio: login_table.bio,
			terms: login_table.terms,
			receive_email: login_table.receive_email,
			date_created: login_table.date_created,
			date_updated: login_table.date_updated,
			store_name: login_table.store_name,
			reward_name: login_table.reward_name,
			credit_balance: login_table.credit_balance,
			category: login_table.category
		})
		.from(login_table)
		.where(eq(login_table.id, userId));
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
	const user = await db.select().from(login_table).where(eq(login_table.token, token));

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
	const result = await db.update(login_table).set(user).where(eq(login_table.id, id)).returning();
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

	const result: BaseUser[] = await db
		.insert(login_table)
		.values(user)
		.onConflictDoNothing()
		.returning();
	if (result.length === 0) {
		return null;
	} else {
		postNewUserTasks(result[0]);
		return result[0];
	}
}

function postNewUserTasks(newUser: BaseUser) {
	if (newUser.is_creator) {
		addDefaultMissionToNewUser(newUser.id);
	}
}

export const UserService = {
	createNewUser,
	updateUser,
	getUserByToken,
	getUserByEmail,
	getUserByUserId
};
