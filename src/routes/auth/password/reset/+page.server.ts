import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { sendPasswordResetEmail } from '$lib/config/email-messages';
import { UserService } from '$lib/server/services/user.service.server';
import { passworUpdateRequestSchema } from '$lib/schema/login.schema.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const form = await superValidate(event, zod(passworUpdateRequestSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(passworUpdateRequestSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const user = await UserService.getUserByEmail(form.data.email);
			if (!user) {
				return setError(
					form,
					'email',
					'Error resetting password. Please contact support if you need further help.'
				);
			}
			const token = crypto.randomUUID();
			await UserService.updateUser(user.id, { token: token });
			await sendPasswordResetEmail(form.data.email, token);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'email',
				'The was a problem resetting your password. Please contact support if you need further help.'
			);
		}
		redirect(302, '/auth/password/reset/success?email=' + form.data.email);
	}
};
