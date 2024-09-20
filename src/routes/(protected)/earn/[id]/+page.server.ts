import { error } from '@sveltejs/kit';
import { ProductService } from '$lib/server/services/product.service.server';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	if (!id) {
		throw error(404, {
			message: `Item not found`,
			code: 'ITEM_NOT_FOUND'
		});
	}

	const followerId = locals.user.id;
	const productId = Number(id);

	const product = await ProductService.getFullProductPurchasedByFollower(productId, followerId);

	return {
		product
	};
};
