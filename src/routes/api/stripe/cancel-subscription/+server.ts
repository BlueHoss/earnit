import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PaymentService } from '$lib/server/services/payment.service.server';

// initialize Stripe
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const result = await PaymentService.cancelSubscription(data.subscriptionId);
	if (!result.success) {
		return json({ success: false, message: result.message, secret: null });
	} else {
		return json({
			success: true,
			message: result.message
		});
	}
};
