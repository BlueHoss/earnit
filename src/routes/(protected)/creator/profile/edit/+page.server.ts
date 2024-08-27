import type { PageServerLoad } from './$types';
import { CreatorProfileService } from '$lib/server/services/creator.profile.service.server';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { profileEditSchema } from '$lib/schema/login.schema';

export const load: PageServerLoad = async ({ locals }) => {
	const dbProfile = await CreatorProfileService.getUserProfile(locals.user.id);
	const form = await superValidate(dbProfile, zod(profileEditSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(profileEditSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await CreatorProfileService.setUserProfile(locals.user.id, form.data);

			throw redirect(303, '/creator/profile');
		} catch (error) {
			if ((error as Error & { status: number }).status === 303) {
				throw error; // Re-throw the redirect
			}

			return fail(500, { form, error: 'Failed to update profile' });
		}
	}
};
