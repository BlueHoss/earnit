import type { PageServerLoad } from './$types';
import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const creatorMarketplaceData = await CreatorDashboardService.loadMarketplaceData(locals.user.id);
	return {
		creatorMarketplaceData
	};
};
