import { CreditService } from '$lib/server/services/credit.service.server';
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 *
 * @returns All of the credits given by this creator
 */
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const credit = await CreditService.getCreditDistributionList(data.creatorId);
	return json({ credit });
};
