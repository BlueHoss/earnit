import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ProductService } from '$lib/server/services/product.service.server';
import { UserService } from '$lib/server/services/user.service.server';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server';

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

	if (currentUser) {
		userCredits = await FollowersDashboardService.availableCredits(currentUser.id);
	}

	return {
		product,
		creator,
		userCredits: userCredits
	};
};

export const actions: Actions = {
	redeemProduct: async ({ request, locals }) => {
		const data = await request.formData();
		const productId = data.get('productId');
		ProductService.redeemProduct(Number(locals.user.id), Number(productId));
	}
};
