import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { productCreateSchema } from '$lib/schema/product.schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { ProductService } from '$lib/server/services/product.service.server';

export const load: PageServerLoad = async (event) => {
	const productId = Number(event.params.id);
	const userId = event.locals.user.id;

	ProductService.getProductById(userId, productId);
	const product = await ProductService.getProductById(userId, productId);
	const form = await superValidate(product, zod(productCreateSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(productCreateSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			//form.data.creator_user_id = request.locals.user.id;
			await ProductService.createProduct(form.data);

			throw redirect(303, '/creator/marketplace');
		} catch (error) {
			if ((error as Error & { status: number }).status === 303) {
				throw error; // Re-throw the redirect
			}

			return fail(500, { form, error: 'Failed to create the product.' });
		}
	}
};
