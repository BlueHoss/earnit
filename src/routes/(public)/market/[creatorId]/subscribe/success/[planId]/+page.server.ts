import { UserService } from '$lib/server/services/user.service.server';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
	const creatorId = Number(params.creatorId);
	const creator = await UserService.getSessioUser(creatorId);
	//const paymentIntenId = url.searchParams.get('payment_intent');
	//console.log('paymentIntenId', paymentIntenId);
	//const planData = await PlanService.getSubscribePageData(userId, creatorId);

	return {
		creator
	};
}
