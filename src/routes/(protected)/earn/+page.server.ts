import type { PageServerLoad } from './$types';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const dashboard = await FollowersDashboardService.loadDashboardData(locals.user.id);

	return {
		dashboard
	};
};
