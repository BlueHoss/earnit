import { PlanService } from '$lib/server/services/plan.service.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

/**
 *
 * @returns All of the Plans this user is subscribed to.
 */
export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const followerId = Number(formData.get('followerId'));
	const creatorId = Number(formData.get('creatorId'));

	const plans = await PlanService.getSubscribedPlans(followerId, creatorId);
	return json({ plans });
};
