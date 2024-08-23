import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { lucia } from '$lib/server/lucia';
import { Argon2id } from 'oslo/password';
import { signInSchema } from '$lib/config/zod-schemas';
import { getUserByEmail } from '$lib/server/database/user-model';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(signInSchema))
	};
};

export const actions: Actions = {
	signin: async ({ request }) => {
		const form = await superValidate(request, zod(signInSchema));
		console.log('Email', form.data.email);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			const email = form.data.email.toLowerCase();
			const existingUser = await getUserByEmail(email);
			if (!existingUser) {
				setFlash({ type: 'error', message: 'The email or password is incorrect.' }, request);
				return setError(form, 'The email or password is incorrect.');
			}
			if (existingUser.hashed_password) {
				const validPassword = await new Argon2id().verify(
					existingUser.hashed_password,
					form.data.password
				);
				if (!validPassword) {
					setFlash({ type: 'error', message: 'The email or password is incorrect.' }, event);
					return setError(form, 'The email or password is incorrect.');
				} else {
					//password valid - set session
					const session = await lucia.createSession(existingUser.id.toString(), {});
					const sessionCookie = lucia.createSessionCookie(session.id);
					event.cookies.set(sessionCookie.name, sessionCookie.value, {
						path: '.',
						...sessionCookie.attributes
					});
					setFlash({ type: 'success', message: 'Sign in successful.' }, event);
				}
			}
		} catch (e) {
			//TODO: need to return error message to client
			console.error(e);
			// email already in use
			//const { fieldErrors: errors } = e.flatten();
			setFlash({ type: 'error', message: 'The email or password is incorrect.' }, event);
			return setError(form, 'The email or password is incorrect.');
		}

		return { form };
	}
};
