import { redirect } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// ...
};
export const actions = {
	default: async (event) => {
		if (!event.locals.user) redirect(302, '/auth/sign-in');
		if (event.locals.session) {
			await lucia.invalidateSession(event.locals.session.id);
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			const message = { type: 'success', message: 'Logged out' } as const;
			redirect(302, '/auth/sign-in', message, event.cookies);
		}
		redirect(302, '/auth/sign-in');
	}
};
