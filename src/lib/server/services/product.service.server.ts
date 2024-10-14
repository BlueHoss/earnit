import db from '$lib/server/database/drizzle';
import { ProductQueryResultSchema } from '$lib/schema/product.schema';
import { z } from 'zod';

import {
	credit_follower_balance,
	credit_transaction,
	login,
	product_invoice,
	product_item,
	product
} from '$lib/server/database/schema';
import type {
	Product,
	ProductItemNewUpdateType,
	ProductNewUpdateType,
	ProductQueryResult,
	ProductWithItemCount
} from '$lib/schema/product.schema';
import { and, eq, sql, sum } from 'drizzle-orm';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET,
	PUBLIC_DEFAULT_PRODUCT_IMAGE
} from '$env/static/public';
import { ImageService } from './image.service.server';
import { type EarnItActionResult, ActionResponse } from '$lib/utils/action-result';

async function createProduct(newProduct: ProductNewUpdateType) {
	if (!newProduct) {
		return null;
	}

	const result: ProductNewUpdateType[] = await db
		.insert(product)
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
			await db.update(product_item).set(productItem).where(eq(product_item.id, productItem.id));
		} else {
			await db.insert(product_item).values(productItem).onConflictDoNothing();
		}
	}
}

async function updateProduct(product: ProductNewUpdateType): Promise<Product | null> {
	if (!product || !product.id || product.id <= 0) {
		return null;
	}

	const result = await db
		.update(product)
		.set(product)
		.where(eq(product.id, product.id))
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

	const result = await db.select().from(product).where(eq(product.creator_user_id, userId));

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

	const result = await db.select().from(product).where(eq(product.id, productId));

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
			id: product.id,
			name: product.name,
			description: product.description,
			creator_user_id: product.creator_user_id,
			cover_image: product.cover_image,
			cost: sql<number>`CAST(${product.cost} AS FLOAT)`.as('cost'),
			enabled: product.enabled,
			item_count:
				sql<number>`(SELECT COUNT(*) FROM ${product_item} WHERE ${product_item.product_id} = ${productId})`.as(
					'item_count'
				)
		})
		.from(product)
		.where(eq(product.id, productId));

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

	const productResult: ProductQueryResult[] = await db
		.select({
			id: product.id,
			creator_user_id: product.creator_user_id,
			name: product.name,
			description: product.description,
			cover_image: product.cover_image,
			cost: sql<number>`CAST(${product_invoice.cost} AS FLOAT)`.as('cost'),
			date_purchased: product_invoice.date_purchased,
			creator_handle: login.handle,
			store_name: login.store_name,
			reward_name: login.reward_name
		})
		.from(product)
		.innerJoin(product_invoice, eq(product_invoice.product_id, product.id))
		.innerJoin(login, eq(login.id, product_invoice.creator_user_id))
		.where(and(eq(product.id, productId), eq(product_invoice.follower_user_id, followerId)));

	if (productResult.length === 0) {
		return null;
	} else {
		const productItems = await db
			.select()
			.from(product_item)
			.where(eq(product_item.product_id, productId));

		productResult[0].productItems = productItems;

		return productResult[0];
	}
}

async function getProductItemsByProductId(
	productId: number
): Promise<ProductItemNewUpdateType[] | []> {
	if (!productId || productId <= 0) {
		return [];
	}

	const result = await db.select().from(product_item).where(eq(product_item.product_id, productId));

	if (result.length === 0) {
		return [];
	} else {
		return result;
	}
}

function getDefaultProduct(userId: number): ProductNewUpdateType {
	const newProduct: ProductNewUpdateType = {
		creator_user_id: userId,
		cover_image: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET}/${PUBLIC_DEFAULT_PRODUCT_IMAGE}`
	};
	return newProduct;
}

async function deleteProductItemById(productItemId: number) {
	try {
		if (!productItemId || productItemId <= 0) {
			console.log('Invalid product item ID');
			return null;
		}

		const deletedProductItem = await db
			.delete(product_item)
			.where(eq(product_item.id, productItemId))
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
		const deletedProduct = await db.delete(product).where(eq(product.id, productId)).returning();

		if (deletedProduct.length === 0) {
			console.log('No product found with the given ID');
			return null;
		}

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
			id: product.id,
			creator_user_id: product.creator_user_id,
			name: product.name,
			description: product.description,
			cover_image: product.cover_image,
			cost: sql<number>`CAST(${product_invoice.cost} AS FLOAT)`.as('cost'),
			date_purchased: product_invoice.date_purchased,
			creator_handle: login.handle,
			store_name: login.store_name,
			reward_name: login.reward_name,
			item_count:
				sql<number>`(SELECT COUNT(*) FROM ${product_item} WHERE ${product_item.product_id} = ${product.id})`.as(
					'item_count'
				)
		})
		.from(product)
		.innerJoin(product_invoice, eq(product_invoice.product_id, product.id))
		.innerJoin(login, eq(login.id, product_invoice.creator_user_id))
		.where(eq(product_invoice.follower_user_id, followerUserId));

	// Validate the results
	const validatedProducts = z.array(ProductQueryResultSchema).parse(products);

	return validatedProducts;
}

async function redeemProductFromCreator(
	creatorId: number,
	followerId: number,
	productId: number
): Promise<EarnItActionResult> {
	try {
		const products = await db.select().from(product).where(eq(product.id, productId));

		if (products.length === 0) {
			console.log('No product found with the given ID');
			return ActionResponse.fail('No product found with the given ID');
		}

		const productDb = products[0];

		// Get existing follower's credit balance for this creator
		const followerCreditRecords = await db
			.select({
				total: sum(credit_follower_balance.credit_balance).as('total')
			})
			.from(credit_follower_balance)
			.where(
				and(
					eq(credit_follower_balance.follower_user_id, followerId),
					eq(credit_follower_balance.creator_user_id, creatorId)
				)
			);

		let creditBalance = 0;
		if (followerCreditRecords.length > 0) {
			creditBalance = Number(followerCreditRecords[0].total);
		} else {
			console.log('You do not have any credit with this creator to purchase this product');
			return ActionResponse.fail(
				'You do not have any credit with this creator to purchase this product'
			);
		}

		if (Number(creditBalance) < Number(productDb.cost)) {
			console.log('You do not have enough credit to purchase this product');
			return ActionResponse.fail('You do not have enough credit to purchase this product');
		}

		// Take credits from follower's balance (if they have enough)
		// Add credits to creator's pool - removed on 9/10/24
		// Add a credit transaction

		await db.transaction(async (tx) => {
			// 1. Create product invoice
			const productInvoice = {
				follower_user_id: followerId,
				creator_user_id: productDb.creator_user_id,
				product_id: productId,
				cost: productDb.cost
			};

			await tx.insert(product_invoice).values(productInvoice).returning();

			// 2. Update creator's credit pool
			// const updatedCreatorPool = await tx
			// 	.update(credit_creator_balance)
			// 	.set({
			// 		available_credits: sql`${credit_creator_balance.available_credits}`
			// 	})
			// 	.where(eq(credit_creator_balance.creator_user_id, creatorId))
			// 	.returning();

			// 3. Insert a new credit transaction
			const newTransaction = await tx
				.insert(credit_transaction)
				.values({
					transaction_type: 'Product_Redemption',
					creator_user_id: creatorId,
					follower_user_id: followerId,
					amount: productDb.cost,
					description: `Credit purchase of ${productDb.name} for ${productDb.cost} credits`
				})
				.returning();

			// 4. Update follower's credit balance
			const updatedFollowerBalance = await tx
				.update(credit_follower_balance)
				.set({
					credit_balance: sql`${credit_follower_balance.credit_balance} - ${productDb.cost}`
				})
				.where(
					and(
						eq(credit_follower_balance.follower_user_id, followerId),
						eq(credit_follower_balance.creator_user_id, creatorId)
					)
				)
				.returning();

			return {
				transaction: newTransaction[0],
				followerBalance: updatedFollowerBalance[0]
			};
		});

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
