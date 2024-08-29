import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { UserService } from '$lib/server/services/user.service.server';
import { Argon2id } from 'oslo/password';
import { passworUpdateSchema } from '$lib/schema/login.schema.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(passworUpdateSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(passworUpdateSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const token = event.params.token as string;
			const newToken = crypto.randomUUID();
			//get email from token
			const user = await UserService.getUserByToken(token);

			if (user) {
				const password = await new Argon2id().hash(form.data.password);
				// need to update with new token because token is also used for verification
				// and needs a new verification token in case user has not verified their account
				// and already forgot their password before verifying. Now they can get a new one resent.
				await UserService.updateUser(user.id, { token: newToken, hashed_password: password });
			} else {
				return setError(
					form,
					'confirmPassword',
					'Email address not found for this token. Please contact support if you need further help.'
				);
			}
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'confirmPassword',
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		const token = event.params.token as string;
		redirect(302, `/auth/password/update-${token}/success`);
	}
};
