import db from '$lib/server/database/drizzle';
import { product_table } from '$lib/server/database/schema';
import type { ProductType, ProductNewUpdateType } from '$lib/schema/product.schema';
import { eq } from 'drizzle-orm';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET,
	PUBLIC_DEFAULT_PRODUCT_IMAGE
} from '$env/static/public';
import { ImageService } from './image.service.server';

async function createProduct(newProduct: ProductNewUpdateType) {
	if (!newProduct) {
		return null;
	}

	const result: ProductNewUpdateType[] = await db
		.insert(product_table)
		.values(newProduct)
		.onConflictDoNothing()
		.returning();

	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

async function updateProduct(product: ProductNewUpdateType): Promise<ProductType | null> {
	if (!product || !product.id || product.id <= 0) {
		return null;
	}

	const result = await db
		.update(product_table)
		.set(product)
		.where(eq(product_table.id, product.id))
		.returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

async function getProductsByUserId(userId: number): Promise<ProductType[] | []> {
	if (!userId || userId <= 0) {
		return [];
	}

	const result = await db
		.select()
		.from(product_table)
		.where(eq(product_table.creator_user_id, userId));

	if (result.length === 0) {
		return [];
	} else {
		return result;
	}
}

async function getProductById(userId: number, productId: number): Promise<ProductType | null> {
	if (!productId || productId <= 0) {
		return getDefaultProduct(userId);
	}

	const result = await db.select().from(product_table).where(eq(product_table.id, productId));

	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

function getDefaultProduct(userId: number): ProductNewUpdateType {
	const product: ProductNewUpdateType = {
		creator_user_id: userId,
		cover_image: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET}/${PUBLIC_DEFAULT_PRODUCT_IMAGE}`
	};
	return product;
}

async function deleteProduct(productId: number) {
	try {
		const deletedProduct = await db
			.delete(product_table)
			.where(eq(product_table.id, productId))
			.returning();

		if (deletedProduct.length === 0) {
			console.log('No product found with the given ID');
			return null;
		}

		console.log('Product deleted successfully');

		console.log("Remove the product's cover image from storage");
		if (deletedProduct[0].cover_image) {
			if (!deletedProduct[0].cover_image.includes(PUBLIC_DEFAULT_PRODUCT_IMAGE)) {
				ImageService.deleteProfileImage(deletedProduct[0].cover_image, 'product_image');
			}
		}

		return deletedProduct[0];
	} catch (error) {
		console.error('Error deleting product:', error);
		throw error;
	}
}

export const ProductService = {
	createProduct,
	getProductById,
	getProductsByUserId,
	updateProduct,
	deleteProduct
};
