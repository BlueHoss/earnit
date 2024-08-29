import { TextUtilities } from '$lib/utils/text-utilities.js';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET
} from '$env/static/public';
import { type BaseUser, type BaseUserUpdate, type SignupUser } from '$lib/schema/login.schema';
import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { login_table } from '$lib/server/database/schema';

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
			profile_pic: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET}/defaultuser.png`,
			tag_line: 'Selling digital products is my jam!',
			bio: 'Say hi. I am new here!',
			token: crypto.randomUUID(),
			date_created: new Date(),
			date_updated: new Date()
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
	const { id: _, ...newUser } = user;

	const result: BaseUser[] = await db
		.insert(login_table)
		.values(newUser)
		.onConflictDoNothing()
		.returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

export const UserService = {
	createNewUser,
	updateUser,
	getUserByToken,
	getUserByEmail
};
