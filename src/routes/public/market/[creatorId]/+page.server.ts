import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server.js';
import { CreatorManagmentService } from '$lib/server/services/creator.management.service.server.js';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server.js';
import { ProductService } from '$lib/server/services/product.service.server.js';
import { UserService } from '$lib/server/services/user.service.server.js';
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
	const creator = await UserService.getUserByUserId(creatorId);
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
			if (followResult) {
				setFlash({ type: 'success', message: 'You are now following!' }, cookies);
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
	}
};
