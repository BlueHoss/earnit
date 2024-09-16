import { CreatorManagmentService } from '$lib/server/services/creator.management.service.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const creators = await CreatorManagmentService.getAllCreators();
	return { creators };
};

//import { redirect } from '@sveltejs/kit';
//Old Load method
// export const load = async ({ locals }) => {
// 	if (!locals.user) {
// 		redirect(302, '/');
// 	} else {
// 		if (locals.user.is_creator) {
// 			redirect(302, '/creator');
// 		}

// 		if (locals.user.is_follower) {
// 			redirect(302, '/follower');
// 		}
// 	}
// };
