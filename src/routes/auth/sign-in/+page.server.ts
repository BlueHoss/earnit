import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { lucia } from '$lib/server/lucia';
import { Argon2id } from 'oslo/password';
import { signInSchema } from '$lib/schema/login.schema';
import { UserService } from '$lib/server/services/user.service.server';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(signInSchema))
	};
};

export const actions: Actions = {
	signin: async (event) => {
		const form = await superValidate(event.request, zod(signInSchema));
		let existingUser = null;

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const email = form.data.email.toLowerCase();
			existingUser = await UserService.getUserByEmail(email);
			if (!existingUser) {
				setFlash({ type: 'error', message: 'The email or password is incorrect.' }, event);
				return setError(form, 'email', 'The email or password is incorrect.');
			}
			if (existingUser.hashed_password) {
				const validPassword = await new Argon2id().verify(
					existingUser.hashed_password,
					form.data.password
				);
				if (!validPassword) {
					setFlash({ type: 'error', message: 'The email or password is incorrect.' }, event);
					return setError(form, 'email', 'The email or password is incorrect.');
				} else {
					//password valid - set session
					const session = await lucia.createSession(existingUser.id.toString(), {
						token: existingUser.token
					});

					const sessionCookie = lucia.createSessionCookie(session.id);
					event.cookies.set(sessionCookie.name, sessionCookie.value, {
						path: '.',
						...sessionCookie.attributes
					});

					setFlash({ type: 'success', message: 'Sign in successful.' }, event);
				}
			}
		} catch {
			setFlash({ type: 'error', message: 'The email or password is incorrect.' }, event);
			return setError(form, 'The email or password is incorrect.');
		}

		const formData = {
			is_creator: existingUser.is_creator,
			is_follower: existingUser.is_follower
		};

		form.data = formData;

		return { form };
	}
};
