import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { updateBaseUserSchema } from '$lib/schema/login.schema';
import { UserService } from '$lib/server/services/user.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const dbUser = await UserService.getUserByUserId(locals.user.id);
	const form = await superValidate(dbUser, zod(updateBaseUserSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(updateBaseUserSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await UserService.updateUser(locals.user.id, form.data);

			throw redirect(303, '/earn');
		} catch (error) {
			if ((error as Error & { status: number }).status === 303) {
				throw error; // Re-throw the redirect
			}

			return fail(500, { form, error: 'Failed to update profile' });
		}
	}
};
