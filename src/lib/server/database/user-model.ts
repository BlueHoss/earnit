import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { login_table } from '$lib/server/database/schema';
import type { User, UpdateUser } from '$lib/server/database/drizzle-schemas';

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
	console.log('UPDATE USER IS THIS CALLED???', user);
	const result = await db.update(login_table).set(user).where(eq(login_table.id, id)).returning();
	console.log('updateUser', result);
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createUser = async (user: User) => {
	//remove ID so that user keeps int..
	delete user.id;

	const result = await db.insert(login_table).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};
