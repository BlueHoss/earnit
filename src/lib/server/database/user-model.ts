import { eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { authUserTable } from '$lib/server/database/migrations/schema';
import type { User, UpdateUser } from '$lib/server/database/drizzle-schemas';

export const getUserByEmail = async (email: string) => {
	const user = await db.select().from(authUserTable).where(eq(authUserTable.email, email));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getUserByToken = async (token: string) => {
	const user = await db.select().from(authUserTable).where(eq(authUserTable.token, token));

	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const updateUser = async (id: number, user: UpdateUser) => {
	console.log('UPDATE USER IS THIS CALLED???', user);
	const result = await db
		.update(authUserTable)
		.set(user)
		.where(eq(authUserTable.id, id))
		.returning();
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

	const result = await db.insert(authUserTable).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};
