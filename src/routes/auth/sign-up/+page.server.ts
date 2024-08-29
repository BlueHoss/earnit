import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schema/login.schema';
import { UserService } from '$lib/server/services/user.service.server.js';
import { sendVerificationEmail } from '$lib/config/email-messages.js';
import { lucia } from '$lib/server/lucia.js';

export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, '/auth/sign-in');
	}
	const form = await superValidate(event, zod(signupSchema));
	return {
		form
	};
};

export const actions = {
	signup: async (event) => {
		const form = await superValidate(event, zod(signupSchema));

		if (!form.valid) {
			console.log('form', form);
			return fail(400, {
				form
			});
		}

		if (form.data.password !== form.data.confirmPassword) {
			return setError(form, 'confirmPassword', "Passwords don't match");
		}

		if (form.data.is_creator === false && form.data.is_follower === false) {
			return setError(form, 'roleError', 'You must select at least one role, Creator or Follower');
		}

		let newUser = null;

		try {
			newUser = await UserService.createNewUser(form.data);

			if (newUser && newUser.id) {
				await sendVerificationEmail(newUser.email, newUser.token);
				const session = await lucia.createSession(newUser.id.toString(), { token: newUser.token });
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				setFlash(
					{
						type: 'success',
						message: 'Account created. Please check your email to verify your account.'
					},
					event
				);
			} else {
				return setError(
					form,
					'email',
					'Account was not created. Is it possible you have an account already?'
				);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Account was not able to be created.' }, event);
			// email already in use
			//might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(form, 'email', 'A user with that email already exists.');
		}

		throw redirect(302, '/both');
		// //TODO: too much redirect. just go to verify email page.
		// if (newUser.is_creator && newUser.is_follower) {
		// 	throw redirect(302, '/both');
		// }

		// if (newUser.is_creator) {
		// 	throw redirect(302, '/creator');
		// }

		// if (newUser.is_follower) {
		// 	throw redirect(302, '/follower');
		// }

		//return { form };
	}
};
