import { ProductService } from '$lib/server/services/product.service.server.js';
import { UserService } from '$lib/server/services/user.service.server.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const creatorId = Number(params.creatorId);

	if (!creatorId) {
		return error(404, 'Not found');
	} else if (isNaN(creatorId)) {
		return error(404, 'Not found');
	}
	//Get the creator and return
	const creator = await UserService.getUserByUserId(creatorId);
	const products = await ProductService.getProductsByUserId(creatorId);
	if (!creator) {
		return error(404, 'Not found');
	}

	return {
		creator,
		products
	};
}
