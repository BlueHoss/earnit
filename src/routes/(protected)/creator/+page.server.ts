import type { PageServerLoad } from './$types';
import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const dashboard = await CreatorDashboardService.loadDashboardData(locals.user.id);

	return {
		dashboard
	};
};
