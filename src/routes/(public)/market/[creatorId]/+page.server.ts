import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server.js';
import { CreatorManagmentService } from '$lib/server/services/creator.management.service.server.js';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server.js';
import { PlanService } from '$lib/server/services/plan.service.server.js';
import { ProductService } from '$lib/server/services/product.service.server.js';
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
	const creator = await CreatorManagmentService.getCreatorWithFollowers(creatorId);
	const products = await ProductService.getProductsByUserId(creatorId);
	const missionActions = await CreatorDashboardService.getMissionActionList(creatorId);

	let followerCredits = 0;
	let followerPurchases = 0;

	if (locals.user) {
		followerCredits = await FollowersDashboardService.getFollowerCreditsByCreator(
			locals.user.id,
			creatorId
		);
		followerPurchases = await FollowersDashboardService.getFollowerProductsPurchasedFromCreator(
			locals.user.id,
			creatorId
		);
	}
	if (!creator) {
		return error(404, 'Not found');
	}

	return {
		creator,
		products,
		missionActions,
		followerCredits,
		followerPurchases
	};
}

export const actions: Actions = {
	followCreator: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const creatorId = data.get('creatorId');

		if (!creatorId) {
			setFlash({ type: 'error', message: 'Creator ID was not found.' }, cookies);
			return fail(400, { error: 'Invalid creatorId' });
		}

		if (Number(creatorId) === locals.user.id) {
			const flashMessage: { type: 'error' | 'success'; message: string } = {
				type: 'error',
				message: 'You cannot follow yourself.'
			};
			setFlash(flashMessage, cookies);
			return fail(400);
		}

		try {
			const followResult = await CreatorManagmentService.addFollower(
				Number(creatorId),
				locals.user.id
			);
			if (followResult && followResult.success) {
				setFlash({ type: 'success', message: 'You are not following this user!' }, cookies);
				return { success: true };
			} else {
				setFlash(
					{
						type: 'error',
						message: 'Follow request failed. You are already following this creator.'
					},
					cookies
				);
				return fail(400);
			}
		} catch (e: unknown) {
			setFlash(
				{ type: 'error', message: 'Failed to add follower to creator: ' + (e as Error).message },
				cookies
			);
			return fail(400);
		}
	},
	unfollowCreator: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const creatorId = data.get('creatorId');

		if (!creatorId) {
			setFlash({ type: 'error', message: 'Creator ID was not found.' }, cookies);
			return fail(400, { error: 'Invalid creatorId' });
		}

		try {
			const followRemoveResult = await CreatorManagmentService.removeFollower(
				Number(creatorId),
				locals.user.id
			);
			if (followRemoveResult) {
				setFlash({ type: 'success', message: 'You have unfollowed this creator.' }, cookies);
				return { success: true };
			} else {
				setFlash(
					{
						type: 'error',
						message: 'There was an issue unfollowing this creator. You may still be following them.'
					},
					cookies
				);
				return fail(400);
			}
		} catch (e: unknown) {
			setFlash(
				{
					type: 'error',
					message: 'System error. Failed to unfollow this creator: ' + (e as Error).message
				},
				cookies
			);
			return fail(400);
		}
	},
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
