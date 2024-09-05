import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { ProductService } from '$lib/server/services/product.service.server';
import { UserService } from '$lib/server/services/user.service.server';

export const load: PageServerLoad = async (event) => {
	if (!event.params.id) {
		throw error(404, {
			message: `Item not found`,
			code: 'ITEM_NOT_FOUND'
		});
	}

	const productId = Number(event.params.id);

	const product = await ProductService.getFullProductListingById(productId);

	if (!product) {
		throw error(404, {
			message: `Item using productId: ${productId} not found`,
			code: 'ITEM_NOT_FOUND'
		});
	}

	const creator = await UserService.getUserByUserId(product.creator_user_id);

	return {
		product,
		creator
	};
};
