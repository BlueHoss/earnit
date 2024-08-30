import { fail, setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { productNewUpdateSchema } from '$lib/schema/product.schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { ProductService } from '$lib/server/services/product.service.server';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const productId = Number(event.params.id);
	const userId = event.locals.user.id;

	ProductService.getProductById(userId, productId);
	const product = await ProductService.getProductById(userId, productId);
	const form = await superValidate(product, zod(productNewUpdateSchema));

	return {
		form
	};
};

export const actions: Actions = {
	update: async ({ request }) => {
		const form = await superValidate(request, zod(productNewUpdateSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (form.data.id === 0 || form.data.id === undefined) {
				//new product
				await ProductService.createProduct(form.data);
			} else {
				//update product
				await ProductService.updateProduct(form.data);
			}

			throw redirect(303, '/creator/marketplace');
		} catch (error) {
			if ((error as Error & { status: number }).status === 303) {
				throw error; // Re-throw the redirect
			}

			return fail(500, { form, error: 'Failed to create the product.' });
		}
	},

	delete: async (event) => {
		const { params } = event;
		const productId = Number(params.id);

		if (isNaN(productId)) {
			return { success: false, error: 'Invalid product ID' };
		}

		try {
			const deletedProduct = await ProductService.deleteProduct(productId);
			if (deletedProduct) {
				setFlash({ type: 'success', message: 'Product deleted successfully' }, event);
			} else {
				setFlash({ type: 'error', message: 'Product was not deleted' }, event);
			}
		} catch (error) {
			console.error('Error in delete action:', error);
			setFlash({ type: 'error', message: 'Product was not deleted' }, event);
		}
		throw redirect(303, '/creator/marketplace');
	}
};
