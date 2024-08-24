import type { PageServerLoad } from './$types';
import type { CreatorDashboard } from '$lib/types';

import {
	getPaidSubscribers,
	getMonthlyRevenue
} from '$lib/server/services/follower-dashboard-service';

export const load: PageServerLoad = async ({ locals }) => {
	const subscriberCount = await getPaidSubscribers(locals.user.id);
	const revenue = await getMonthlyRevenue(locals.user.id);

	const creatorDashboard: CreatorDashboard = { subscriberCount, revenue };

	return {
		creatorDashboard
	};
};
