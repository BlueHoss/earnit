import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ProductService } from '$lib/server/services/product.service.server';
import { UserService } from '$lib/server/services/user.service.server';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server';
import { setFlash } from 'sveltekit-flash-message/server';
import type { EarnItActionResult } from '$lib/utilities/action-result';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { creatorId, id } = params;
	const currentUser = locals.user;

	if (!id) {
		throw error(404, {
			message: `Item not found`,
			code: 'ITEM_NOT_FOUND'
		});
	}

	const productId = Number(id);

	const product = await ProductService.getProductListingById(productId);

	if (!product) {
		throw error(404, {
			message: `Item using productId: ${productId} not found`,
			code: 'ITEM_NOT_FOUND'
		});
	}

	const creator = await UserService.getUserByUserId(Number(creatorId));

	let userCredits = 0;
	let products: { id: number }[] = [];

	if (currentUser) {
		userCredits = await FollowersDashboardService.getFollowerCreditsByCreator(
			currentUser.id,
			Number(creatorId)
		);

		products = await FollowersDashboardService.getFollowerProductsByCreatorList(
			currentUser.id,
			Number(creatorId)
		);
	}

	return {
		product,
		creator,
		userCredits: userCredits,
		products
	};
};

export const actions: Actions = {
	redeemProduct: async (event) => {
		try {
			const data = await event.request.formData();
			const productId = data.get('productId');
			const creatorId = data.get('creatorId');

			const result: EarnItActionResult = await ProductService.redeemProductFromCreator(
				Number(creatorId),
				Number(event.locals.user.id),
				Number(productId)
			);

			if (result.success) {
				setFlash({ type: 'success', message: 'Product redeemed successfully' }, event);
				return { success: true, message: 'Product redeemed successfully' };
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
