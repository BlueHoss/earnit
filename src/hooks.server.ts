import { lucia } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit';

import log from '$lib/server/log';
import type { User } from 'lucia';
import { UserService } from '$lib/server/services/user.service.server';

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	event.locals.error = error?.toString() || '';
	if (error instanceof Error) {
		event.locals.errorStackTrace = error.stack || '';
	} else {
		event.locals.errorStackTrace = '';
	}
	event.locals.errorId = errorId;
	log(500, event);

	return {
		message: 'An unexpected error occurred.',
		errorId
	};
};
export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	const sessionId = event.cookies.get(lucia.sessionCookieName);

	const { session, user } = sessionId
		? await lucia.validateSession(sessionId)
		: { session: null, user: null };

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	event.locals.session = session;
	//event.locals.user = user;

	//Build the getUserWithProfile function to load a joined user and account balance.
	if (user) {
		const fullUser = await UserService.getSessioUser(Number(user.id));
		event.locals.user = fullUser;
	} else {
		event.locals.user = null;
	}

	if (event.route.id?.startsWith('/(protected)')) {
		if (!user) redirect(302, '/auth/sign-in');
		if (!user.verified) redirect(302, '/auth/verify/email');
	}
	if (event.route.id?.startsWith('/(admin)')) {
		if (user?.role !== 'ADMIN') redirect(302, '/auth/sign-in');
	}

	if (event.route.id?.startsWith('/(protected)/creator')) {
		const usertype = getUserType(user);
		if (usertype === 'follower') redirect(302, '/earn');
	}

	if (event.route.id?.startsWith('/(protected)/follower')) {
		const usertype = getUserType(user);
		if (usertype === 'creator') redirect(302, '/creator');
	}

	const response = await resolve(event);
	//log(response.status, event);
	return response;
};

function getUserType(user: User | null) {
	if (!user) return 'none';
	if (user.is_creator && user.is_follower) {
		return 'both';
	}
	if (user.is_creator) {
		return 'creator';
	}
	if (user.is_follower) {
		return 'follower';
	}
	return 'none';
}
