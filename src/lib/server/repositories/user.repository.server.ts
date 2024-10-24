import { type BaseUser } from '$lib/schema/login.schema';
import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { login } from '$lib/server/database/schema';

async function getUserById(userId: number): Promise<BaseUser | null> {
	const where = eq(login.id, userId);
	const users = await db.select().from(login).where(where);
	return users.length > 0 ? users[0] : null;
}

async function getUserByEmail(email: string): Promise<BaseUser | null> {
	const where = eq(login.email, email);
	const users = await db.select().from(login).where(where);
	return users.length > 0 ? users[0] : null;
}

/**
 * Get user by social media profile from the login table
 * @param socialMediaProfile user social media profile name in login table
 * @returns BaseUser | null
 */
async function getUserBySocialMediaProfile(socialMediaProfile: string): Promise<BaseUser | null> {
	const where = eq(login.social_media_profile, socialMediaProfile);
	const users = await db.select().from(login).where(where);
	return users.length > 0 ? users[0] : null;
}

export const UserRepository = {
	getUserBySocialMediaProfile,
	getUserByEmail,
	getUserById
};
