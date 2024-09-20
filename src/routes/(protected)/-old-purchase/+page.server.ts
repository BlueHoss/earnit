import { ProductService } from '$lib/server/services/product.service.server.js';
// import { UserService } from '$lib/server/services/user.service.server.js';
// import { error, fail, type Actions } from '@sveltejs/kit';
// import { setFlash } from 'sveltekit-flash-message/server';

export async function load({ locals }) {
	const followerId = locals.user.id;

	const products = await ProductService.getProductsPurchasedByFollower(followerId);

	return {
		products
	};
}
