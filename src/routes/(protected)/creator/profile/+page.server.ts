import type { PageServerLoad } from './$types';
import { CreatorProfileService } from '$lib/server/services/creator.profile.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const bio = await CreatorProfileService.getUserBio(locals.user.id);
	return {
		bio
	};
};
