import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { Argon2id } from 'oslo/password';
import { createUser } from '$lib/server/database/user-model';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/config/zod-schemas';
import { sendVerificationEmail } from '$lib/config/email-messages';
import { lucia } from '$lib/server/lucia.js';

export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}
	const form = await superValidate(event, zod(userSchema));
	return {
		form
	};
};

export const actions = {
	signup: async (event) => {
		const form = await superValidate(event, zod(userSchema));

		let newUser = null;

		if (!form.valid) {
			console.log('form', form);
			return fail(400, {
				form
			});
		}

		if (form.data.password !== form.data.confirmPassword) {
			return setError(form, 'confirmPassword', "Passwords don't match");
		}

		if (form.data.isCreator === false && form.data.isFollower === false) {
			return setError(form, 'roleError', 'You must select at least one role, Creator or Follower');
		}

		try {
			const password = await new Argon2id().hash(form.data.password);
			const token = crypto.randomUUID();
			const id = 0;

			const user = {
				id: id,
				email: form.data.email.toLowerCase(),
				first_name: form.data.firstName,
				last_name: form.data.lastName,
				hashed_password: password,
				username: form.data.firstName + '_' + form.data.lastName,
				role: 'USER',
				verified: false,
				receive_email: true,
				token: token,
				created_at: new Date(),
				updated_at: new Date(),
				is_creator: form.data.isCreator,
				is_follower: form.data.isFollower
			};
			newUser = await createUser(user);
			if (newUser) {
				console.log('newUser	', newUser);
				await sendVerificationEmail(newUser.email, token);
				const session = await lucia.createSession(newUser.id.toString(), { token: token });
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

		if (newUser.is_creator && newUser.is_follower) {
			throw redirect(302, '/both');
		}

		if (newUser.is_creator) {
			throw redirect(302, '/creator');
		}

		if (newUser.is_follower) {
			throw redirect(302, '/follower');
		}

		return { form };
	}
};
