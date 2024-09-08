import db from '$lib/server/database/drizzle';
import { ProductQueryResultSchema } from '$lib/schema/product.schema';
import { z } from 'zod';

import {
	login_table,
	product_invoice_table,
	product_item_table,
	product_table
} from '$lib/server/database/schema';
import type {
	Product,
	ProductItemNewUpdateType,
	ProductNewUpdateType,
	ProductQueryResult,
	ProductWithItemCount
} from '$lib/schema/product.schema';
import { and, eq, sql } from 'drizzle-orm';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET,
	PUBLIC_DEFAULT_PRODUCT_IMAGE
} from '$env/static/public';
import { ImageService } from './image.service.server';
import { date } from 'drizzle-orm/mysql-core';

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

async function getProductListingById(productId: number): Promise<ProductWithItemCount | null> {
	if (!productId || productId <= 0) return null;

	const result = await db
		.select({
			id: product_table.id,
			name: product_table.name,
			description: product_table.description,
			creator_user_id: product_table.creator_user_id,
			cover_image: product_table.cover_image,
			cost: sql<number>`CAST(${product_table.cost} AS FLOAT)`.as('cost'),
			enabled: product_table.enabled,
			item_count:
				sql<number>`(SELECT COUNT(*) FROM ${product_item_table} WHERE ${product_item_table.product_id} = ${productId})`.as(
					'item_count'
				)
		})
		.from(product_table)
		.where(eq(product_table.id, productId));

	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

async function getFullProductPurchasedByFollower(
	productId: number,
	followerId: number
): Promise<ProductQueryResult | null> {
	if (!productId || productId <= 0) {
		return null;
	}

	const product: ProductQueryResult[] = await db
		.select({
			id: product_table.id,
			creator_user_id: product_table.creator_user_id,
			name: product_table.name,
			description: product_table.description,
			cover_image: product_table.cover_image,
			cost: sql<number>`CAST(${product_invoice_table.cost} AS FLOAT)`.as('cost'),
			date_purchased: product_invoice_table.date_purchased,
			creator_handle: login_table.handle,
			store_name: login_table.store_name,
			reward_name: login_table.reward_name
		})
		.from(product_table)
		.innerJoin(product_invoice_table, eq(product_invoice_table.product_id, product_table.id))
		.innerJoin(login_table, eq(login_table.id, product_invoice_table.creator_user_id))
		.where(
			and(eq(product_table.id, productId), eq(product_invoice_table.follower_user_id, followerId))
		);

	if (product.length === 0) {
		return null;
	} else {
		const productItems = await db
			.select()
			.from(product_item_table)
			.where(eq(product_item_table.product_id, productId));

		product[0].productItems = productItems;

		return product[0];
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

async function getProductsPurchasedByFollower(
	followerUserId: number
): Promise<ProductQueryResult[]> {
	const products = await db
		.select({
			id: product_table.id,
			creator_user_id: product_table.creator_user_id,
			name: product_table.name,
			description: product_table.description,
			cover_image: product_table.cover_image,
			cost: sql<number>`CAST(${product_invoice_table.cost} AS FLOAT)`.as('cost'),
			date_purchased: product_invoice_table.date_purchased,
			creator_handle: login_table.handle,
			store_name: login_table.store_name,
			reward_name: login_table.reward_name,
			item_count:
				sql<number>`(SELECT COUNT(*) FROM ${product_item_table} WHERE ${product_item_table.product_id} = ${product_table.id})`.as(
					'item_count'
				)
		})
		.from(product_table)
		.innerJoin(product_invoice_table, eq(product_invoice_table.product_id, product_table.id))
		.innerJoin(login_table, eq(login_table.id, product_invoice_table.creator_user_id))
		.where(eq(product_invoice_table.follower_user_id, followerUserId));

	// Validate the results
	const validatedProducts = z.array(ProductQueryResultSchema).parse(products);

	return validatedProducts;
}

async function redeemProduct(followerUserId: number, productId: number) {
	const product = await db.select().from(product_table).where(eq(product_table.id, productId));

	if (product.length === 0) {
		console.log('No product found with the given ID');
		return null;
	}

	const productInvoice = {
		follower_user_id: followerUserId,
		creator_user_id: product[0].creator_user_id,
		product_id: productId,
		cost: product[0].cost
	};

	const result = await db.insert(product_invoice_table).values(productInvoice).returning();

	if (result.length === 0) {
		console.log('Failed to redeem product');
		return null;
	}

	return result[0];
}

export const ProductService = {
	createProduct,
	getProductById,
	getProductsByUserId,
	updateProduct,
	deleteProduct,
	getProductItemsByProductId,
	deleteProductItemById,
	getProductListingById,
	getProductsPurchasedByFollower,
	getFullProductPurchasedByFollower,
	redeemProduct
};
