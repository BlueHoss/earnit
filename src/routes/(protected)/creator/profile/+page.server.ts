import type { PageServerLoad } from './$types';
import { getUserBio } from '$lib/server/services/creatorprofile.service';

export const load: PageServerLoad = async ({ locals }) => {
	const bio = await getUserBio(locals.user.id);
	return {
		bio
	};
};
