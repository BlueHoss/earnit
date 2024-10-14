import { PUBLIC_BASE_URL } from '$env/static/public';
import { PlanService } from '$lib/server/services/plan.service.server';
import type { EarnItActionResult } from '$lib/utils/action-result.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
	const creatorId = Number(params.creatorId);
	const userId = locals.user.id;

	const planData = await PlanService.getSubscribePageData(userId, creatorId);

	return {
		creatorId,
		userId,
		planData
	};
}

export const actions: Actions = {
	//Free plan follows this path. All other plans follow the api/stripe/webhooks/+server.ts path, stripe calls after payment success.
	purchaseProduct: async (event) => {
		try {
			const data = await event.request.formData();
			const planId = data.get('planId');
			const creatorId = data.get('creatorId');
			const userId = data.get('userId');
			const stripeSubscriptionId = data.get('stripeSubscriptionId') as string;

			const result: EarnItActionResult = await PlanService.purchaseRecurringPlan(
				Number(creatorId),
				Number(userId),
				Number(planId),
				stripeSubscriptionId
			);

			if (result.success) {
				const successUrl = new URL(
					`/market/${creatorId}/subscribe/success/${planId}`,
					PUBLIC_BASE_URL
				).toString();
				return redirect(302, successUrl);
			} else {
				const errorMessage = result.message ?? 'Unknown error occurred';
				setFlash({ type: 'error', message: errorMessage }, event);
				return fail(400, {
					errors: [errorMessage]
				});
			}
		} catch (err) {
			console.error('Unexpected error:', err);
			const errorMessage = 'An unexpected error occurred';
			return fail(500, {
				errors: [errorMessage]
			});
		}
	},

	planUnsubscribe: async (event) => {
		const data = await event.request.formData();
		const planId = data.get('planId');
		const creatorId = data.get('creatorId');
		const userId = data.get('userId');
		try {
			const result: EarnItActionResult = await PlanService.cancelSubscription(
				Number(userId),
				Number(creatorId),
				Number(planId)
			);

			if (result.success) {
				setFlash({ type: 'success', message: 'Subscription success!' }, event);
				//return { success: true, message: 'Subscription processed successfully' };
			} else {
				const errorMessage = result.message ?? 'Unknown error occurred';
				setFlash({ type: 'error', message: errorMessage }, event);
				return fail(400, {
					errors: [errorMessage]
				});
			}
		} catch (err) {
			console.error('Unexpected error:', err);
			const errorMessage = 'An unexpected error occurred';
			return fail(500, {
				errors: [errorMessage]
			});
		}
		throw redirect(302, `/market/${creatorId}`);
	}
};
