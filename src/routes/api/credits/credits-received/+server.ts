import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server';
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 *
 * @returns All of the credits recieved by this creator
 */
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const credit = await FollowersDashboardService.getFollowerCreditBalanceDetails(data.followerId);
	return json({ credit });
};
