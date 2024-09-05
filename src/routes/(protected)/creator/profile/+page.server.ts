import type { PageServerLoad } from './$types';
import { CreatorManagmentService } from '$lib/server/services/creator.management.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const bio = await CreatorManagmentService.getUserBio(locals.user.id);
	return {
		bio
	};
};
