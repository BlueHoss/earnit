import type { PageServerLoad } from './$types';
import { UserService } from '$lib/server/services/user.service.server';
import { baseUserModifedSchema } from '$lib/schema/login.schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const userStoreInfo = await UserService.getUserByUserId(locals.user.id);

	const form = await superValidate(userStoreInfo, zod(baseUserModifedSchema));

	return {
		form
	};
};

export const actions: Actions = {
	updatesettings: async ({ request, locals }) => {
		const form = await superValidate(request, zod(baseUserModifedSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await UserService.updateUser(locals.user.id, form.data);

			throw redirect(303, '/creator');
		} catch (error) {
			if ((error as Error & { status: number }).status === 303) {
				throw error; // Re-throw the redirect
			}

			return fail(500, { form, error: 'Failed to update user store.' });
		}
	}
};
