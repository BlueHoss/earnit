import { CreatorManagmentService } from '$lib/server/services/creator.management.service.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const creators = await CreatorManagmentService.getAllCreators();
	return { creators };
};
