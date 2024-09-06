import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { productNewUpdateSchema } from '$lib/schema/product.schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { ProductService } from '$lib/server/services/product.service.server';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const productId = Number(event.params.id);
	const userId = event.locals.user.id;

	const product = await ProductService.getProductById(userId, productId);

	if (!product) {
		throw redirect(303, '/creator/marketplace');
	}

	//Get file uploads associated to this product.
	const productItems = await ProductService.getProductItemsByProductId(productId);
	product.productItems = productItems;
	const form = await superValidate(product, zod(productNewUpdateSchema));

	return {
		form
	};
};

export const actions: Actions = {
	update: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(productNewUpdateSchema));

		if (!form.valid) {
			return fail(400, { form });
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
	},

	deleteProductItem: async (event) => {
		const formData = await event.request.formData();
		const productItemId = parseInt(formData.get('productItemId') as string);

		if (isNaN(productItemId)) {
			return setFlash({ type: 'success', message: 'Product item deleted successfully' }, event);
		}

		try {
			const deletedProductItem = await ProductService.deleteProductItemById(productItemId);
			if (deletedProductItem) {
				return setFlash({ type: 'success', message: 'Product item deleted successfully' }, event);
			} else {
				return setFlash({ type: 'error', message: 'Product item was not deleted' }, event);
			}
		} catch (error) {
			console.error('Error in deleteProductItem action:', error);
			return setFlash({ type: 'error', message: 'Product item was not deleted' }, event);
		}
		//throw redirect(303, '/creator/marketplace');
	}
};
