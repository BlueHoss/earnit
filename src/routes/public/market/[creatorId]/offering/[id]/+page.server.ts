import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ProductService } from '$lib/server/services/product.service.server';
import { UserService } from '$lib/server/services/user.service.server';

export const load: PageServerLoad = async ({ params }) => {
	const { creatorId, id } = params;

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

	return {
		product,
		creator
	};
};
