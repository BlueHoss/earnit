import type { PlanWithSubscription } from '$lib/schema/plan.schema.js';
import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server.js';
import { CreatorManagmentService } from '$lib/server/services/creator.management.service.server.js';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server.js';
import { PlanService } from '$lib/server/services/plan.service.server.js';
import { ProductService } from '$lib/server/services/product.service.server.js';
import { UserService } from '$lib/server/services/user.service.server.js';
import type { EarnItActionResult } from '$lib/utils/action-result.js';
import { error, fail, type Actions } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
	const creatorId = Number(params.creatorId);

	if (!creatorId) {
		return error(404, 'Not found');
	} else if (isNaN(creatorId)) {
		return error(404, 'Not found');
	}

	//Get the creator and return
	const creator = await UserService.getSessioUser(creatorId);
	const products = await ProductService.getProductsByUserId(creatorId);
	const missionActions = await CreatorDashboardService.getMissionActionList(creatorId);

	let followerCredits = 0;
	let followerPurchases = 0;
	let followerPlan = null;

	if (locals.user) {
		followerCredits = await FollowersDashboardService.getFollowerCreditsByCreator(
			locals.user.id,
			creatorId
		);
		followerPurchases = await FollowersDashboardService.getFollowerProductsPurchasedFromCreator(
			locals.user.id,
			creatorId
		);
		followerPlan = await PlanService.getSubscriberPlan(locals.user.id, creatorId);
	}
	if (!creator) {
		return error(404, 'Not found');
	}

	return {
		creator,
		products,
		missionActions,
		followerCredits,
		followerPurchases,
		followerPlan
	};
}

export const actions: Actions = {
	purchaseProduct: async (event) => {
		try {
			const data = await event.request.formData();
			const planId = data.get('planId');
			const creatorId = data.get('creatorId');
			const userId = data.get('userId');

			const result: EarnItActionResult = await PlanService.purchaseRecurringPlan(
				Number(creatorId),
				Number(userId),
				Number(planId)
			);

			if (result.success) {
				setFlash({ type: 'success', message: 'Subscription success!' }, event);
				return { success: true, message: 'Subscription processed successfully' };
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
		try {
			const data = await event.request.formData();
			const planId = data.get('planId');
			const creatorId = data.get('creatorId');
			const userId = data.get('userId');

			const result: EarnItActionResult = await PlanService.unsubscribeFromPlan(
				Number(creatorId),
				Number(userId),
				Number(planId)
			);

			if (result.success) {
				setFlash({ type: 'success', message: 'Subscription success!' }, event);
				return { success: true, message: 'Subscription processed successfully' };
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
	}
};
