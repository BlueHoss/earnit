import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PaymentService } from '$lib/server/services/payment.service.server';

// initialize Stripe
export const POST: RequestHandler = async ({ request, locals }) => {
	//console.log('request', request);
	const data = await request.json();

	//return json({ success: false, message: 'error', clientSecret: data.planId });
	//return new Response(JSON.stringify({ success: true }), { status: 200 });
	const result = await PaymentService.billUserFirstTime(locals.user, data.planId, data.creatorId);
	if (!result.success) {
		return json({ success: false, message: result.message, secret: null });
	} else {
		return json({
			success: true,
			message: result.message,
			secret: result.data?.secret,
			returnUrl: result.data?.returnUrl,
			subscriptionId: result.data?.subscriptionId
		});
	}
};
