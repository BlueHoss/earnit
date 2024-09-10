// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { login_table, auth_session_table } from '$lib/server/database/schema';
import db from '$lib/server/database/drizzle';
import { dev } from '$app/environment';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

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
			//Used to determin if createor, follower or public.
			user_type: attributes.is_creator ? 'creator' : attributes.is_follower ? 'follower' : 'public',
			provider: attributes.provider,
			providerId: attributes.providerId,
			email: attributes.email,
			handle: attributes.handle,
			first_name: attributes.first_name,
			last_name: attributes.last_name,
			role: attributes.role,
			verified: attributes.verified,
			receiveEmail: attributes.receiveEmail,
			token: attributes.token,
			is_creator: attributes.is_creator,
			is_follower: attributes.is_follower,
			follower_count: attributes.follower_count,
			profile_pic: attributes.profile_pic,
			initials: makeInitials(attributes.first_name, attributes.last_name),
			title: attributes.title,
			tag_line: attributes.tag_line,
			store_name: attributes.store_name,
			reward_name: attributes.reward_name,
			credit_balance: attributes.credit_balance
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
	handle: string;
	first_name: string;
	last_name: string;
	role: string;
	verified: boolean;
	receiveEmail: boolean;
	token: string;
	is_creator: boolean;
	is_follower: boolean;
	follower_count: number;
	profile_pic: string;
	initials: string;
	title: string;
	tag_line: string;
	store_name: string;
	reward_name: string;
	credit_balance: string;
}

function makeInitials(firstName: string, lastName: string) {
	const firstLetter = !firstName ? '' : firstName.charAt(0);
	const lastLetter = !lastName ? '' : lastName.charAt(0);
	return firstLetter + lastLetter;
}

const googleRedirectUrl = dev
	? 'http://localhost:5173/auth/oauth/google/callback'
	: `${PUBLIC_BASE_URL}/auth/oauth/google/callback`;

export const googleOauth = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, googleRedirectUrl);
