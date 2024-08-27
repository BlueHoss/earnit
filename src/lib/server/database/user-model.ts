import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { login_table } from '$lib/server/database/schema';
import type { User, UpdateUser } from '$lib/server/database/schema';
import type { BaseUser } from '$lib/schema/login.schema';

export const getUserByEmail = async (email: string) => {
	const user = await db.select().from(login_table).where(eq(login_table.email, email));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getUserByToken = async (token: string) => {
	const user = await db.select().from(login_table).where(eq(login_table.token, token));

	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const updateUser = async (id: number, user: UpdateUser) => {
	const result = await db.update(login_table).set(user).where(eq(login_table.id, id)).returning();
	console.log('updateUser', result);
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export async function createUser(user: BaseUser): Promise<User | null> {
	const result = await db.insert(login_table).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}
