// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { login_table, auth_session_table } from '$lib/server/database/schema';
import db from '$lib/server/database/drizzle';
import { dev } from '$app/environment';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

import { BASE_URL } from '$lib/config/constants';

const adapter = new DrizzlePostgreSQLAdapter(db, auth_session_table, login_table);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: !dev
		}
	},
	sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
	getUserAttributes: (attributes) => {
		return {
			userId: attributes.id,
			provider: attributes.provider,
			providerId: attributes.providerId,
			email: attributes.email,
			username: attributes.firstName + ' ' + attributes.lastName,
			firstName: attributes.firstName,
			lastName: attributes.lastName,
			role: attributes.role,
			verified: attributes.verified,
			receiveEmail: attributes.receiveEmail,
			token: attributes.token,
			is_creator: attributes.is_creator,
			is_follower: attributes.is_follower
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		//DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	id: number;
	provider: string;
	providerId: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	verified: boolean;
	receiveEmail: boolean;
	token: string;
	is_creator: boolean;
	is_follower: boolean;
}

const googleRedirectUrl = dev
	? 'http://localhost:5173/auth/oauth/google/callback'
	: `${BASE_URL}/auth/oauth/google/callback`;

export const googleOauth = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, googleRedirectUrl);
