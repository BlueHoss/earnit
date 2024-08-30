import db from '$lib/server/database/drizzle';
import { product_table } from '$lib/server/database/schema';
import type { ProductType, ProductCreateType } from '$lib/schema/product.schema';
import { eq } from 'drizzle-orm';
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET
} from '$env/static/public';

async function createProduct(newProduct: ProductCreateType) {
	if (!newProduct) {
		return null;
	}

	const result: ProductCreateType[] = await db
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

function getDefaultProduct(userId: number): ProductCreateType {
	const product: ProductCreateType = {
		creator_user_id: userId,
		cover_image: `${PUBLIC_SUPABASE_STORAGE_URL}/${PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET}/default_product_image.webp`
	};
	return product;
}

export const ProductService = {
	createProduct,
	getProductById,
	getProductsByUserId
};
