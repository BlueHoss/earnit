import type { PageServerLoad } from './$types';
import { getUserProfile, setUserProfile } from '$lib/server/services/creatorprofile.service';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { userProfile } from '$lib/config/zod-schemas';

export const load: PageServerLoad = async ({ locals }) => {
	const dbProfile = await getUserProfile(locals.user.id);
	const form = await superValidate(dbProfile, zod(userProfile));
	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(userProfile));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await setUserProfile(locals.user.id, form.data);

			throw redirect(303, '/creator/profile');
		} catch (error) {
			if ((error as any).status === 303) {
				throw error; // Re-throw the redirect
			}

			return fail(500, { form, error: 'Failed to update profile' });
		}
	}
};
