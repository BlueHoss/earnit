import db from '$lib/server/database/drizzle';
import { product_item_table, product_table } from '$lib/server/database/schema';
import type {
	Product,
	ProductItemNewUpdateType,
	ProductNewUpdateType
} from '$lib/schema/product.schema';
import { eq } from 'drizzle-orm';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET,
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
		uploadProductItems(result[0].id, newProduct.productItems);
		return result[0];
	}
}

async function uploadProductItems(productId: number, productItems: ProductItemNewUpdateType[]) {
	if (!productItems || productItems.length === 0) {
		return [];
	}

	for (let i = 0; i < productItems.length; i++) {
		const productItem = productItems[i];
		const file = productItem.file;

		if (file) {
			//This item is new and we need to upload.
			const url = await ImageService.uploadProfileImage(file, 'product_image');
			productItem.file_name = file.name;
			productItem.download_url = url;
		}

		productItem.product_id = productId;

		if (productItem.id && !isNaN(productItem.id)) {
			await db
				.update(product_item_table)
				.set(productItem)
				.where(eq(product_item_table.id, productItem.id));
		} else {
			await db.insert(product_item_table).values(productItem).onConflictDoNothing();
		}
	}
}

async function updateProduct(product: ProductNewUpdateType): Promise<Product | null> {
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
		uploadProductItems(product.id, product.productItems);
		return result[0];
	}
}

async function getProductsByUserId(userId: number): Promise<Product[] | []> {
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

async function getProductById(userId: number, productId: number): Promise<Product | null> {
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

async function getProductItemsByProductId(
	productId: number
): Promise<ProductItemNewUpdateType[] | []> {
	if (!productId || productId <= 0) {
		return [];
	}

	const result = await db
		.select()
		.from(product_item_table)
		.where(eq(product_item_table.product_id, productId));

	if (result.length === 0) {
		return [];
	} else {
		return result;
	}
}

function getDefaultProduct(userId: number): ProductNewUpdateType {
	const product: ProductNewUpdateType = {
		creator_user_id: userId,
		cover_image: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET}/${PUBLIC_DEFAULT_PRODUCT_IMAGE}`
	};
	return product;
}

async function deleteProductItemById(productItemId: number) {
	try {
		if (!productItemId || productItemId <= 0) {
			console.log('Invalid product item ID');
			return null;
		}

		const deletedProductItem = await db
			.delete(product_item_table)
			.where(eq(product_item_table.id, productItemId))
			.returning();

		if (deletedProductItem.length === 0) {
			console.log('No product item found with the given ID');
			return null;
		}

		console.log('Product item deleted successfully');

		if (deletedProductItem[0].download_url) {
			if (!deletedProductItem[0].download_url.includes(PUBLIC_DEFAULT_PRODUCT_IMAGE)) {
				ImageService.deleteProfileImage(deletedProductItem[0].download_url, 'product_image');
			}
		}

		return deletedProductItem[0];
	} catch (error) {
		console.error('Error deleting product item:', error);
		throw error;
	}
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
	deleteProduct,
	getProductItemsByProductId,
	deleteProductItemById
};
