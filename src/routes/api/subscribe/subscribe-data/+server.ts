import { PlanService } from '$lib/server/services/plan.service.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

/**
 *
 * @returns All of the system Plans
 */
export const GET: RequestHandler = async () => {
	const plans = await PlanService.getPlans();
	return json({ plans });
};
