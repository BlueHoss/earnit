import db from '$lib/server/database/drizzle';
import { ProductQueryResultSchema } from '$lib/schema/product.schema';
import { z } from 'zod';

import {
	credit_creator_pool_table,
	credit_follower_balance_table,
	credit_transaction_table,
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
import { type ActionResult, ActionResponse } from '$lib/utils/action-result';

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

async function redeemProductFromCreator(
	creatorId: number,
	followerId: number,
	productId: number
): Promise<ActionResult> {
	try {
		const products = await db.select().from(product_table).where(eq(product_table.id, productId));

		if (products.length === 0) {
			console.log('No product found with the given ID');
			return ActionResponse.fail('No product found with the given ID');
		}

		const product = products[0];

		// Get existing follower's credit balance for this creator
		const followerCreditRecords = await db
			.select()
			.from(credit_follower_balance_table)
			.where(
				and(
					eq(credit_follower_balance_table.follower_user_id, followerId),
					eq(credit_follower_balance_table.creator_user_id, creatorId)
				)
			);

		let followerCreditRecord = null;
		if (followerCreditRecords.length === 1) {
			followerCreditRecord = followerCreditRecords[0];
		}

		if (!followerCreditRecord) {
			console.log('You do not have any credit with this creator to purchase this product');
			return ActionResponse.fail(
				'You do not have any credit with this creator to purchase this product'
			);
		}

		if (Number(followerCreditRecord.credit_balance) < Number(product.cost)) {
			console.log('You do not have enough credit to purchase this product');
			return ActionResponse.fail('You do not have enough credit to purchase this product');
		}

		// Take credits from follower's balance (if they have enough)
		// Add credits to creator's pool
		// Add a credit transaction

		const result = await db.transaction(async (tx) => {
			// 1. Create product invoice
			const productInvoice = {
				follower_user_id: followerId,
				creator_user_id: product.creator_user_id,
				product_id: productId,
				cost: product.cost
			};

			await tx.insert(product_invoice_table).values(productInvoice).returning();

			// 2. Update creator's credit pool
			const updatedCreatorPool = await tx
				.update(credit_creator_pool_table)
				.set({
					available_credits: sql`${credit_creator_pool_table.available_credits} + ${product.cost}`
				})
				.where(eq(credit_creator_pool_table.creator_user_id, creatorId))
				.returning();

			// 3. Insert a new credit transaction
			const newTransaction = await tx
				.insert(credit_transaction_table)
				.values({
					transaction_type: 'product redemption',
					creator_user_id: creatorId,
					follower_user_id: followerId,
					amount: product.cost,
					description: `Credit purchase of ${product.cost} for product redemption`
				})
				.returning();

			// 4. Update follower's credit balance
			const updatedFollowerBalance = await tx
				.update(credit_follower_balance_table)
				.set({
					credit_balance: sql`${credit_follower_balance_table.credit_balance} - ${product.cost}`
				})
				.where(
					and(
						eq(credit_follower_balance_table.follower_user_id, followerId),
						eq(credit_follower_balance_table.creator_user_id, creatorId)
					)
				)
				.returning();

			return {
				creatorPool: updatedCreatorPool[0],
				transaction: newTransaction[0],
				followerBalance: updatedFollowerBalance[0]
			};
		});

		console.log('Transaction completed successfully:', result);
		return ActionResponse.success('product redeemed successfully');
	} catch (error) {
		console.error('Transaction failed:', error);
		return ActionResponse.fail(
			'An error occurred while redeeming the product. Please try again later.'
		);
	}
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
	redeemProductFromCreator
};
