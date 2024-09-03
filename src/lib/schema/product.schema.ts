import { z } from 'zod';

export const productSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1, { message: 'Product name is required' }),
	description: z.string().nullable(),
	creator_user_id: z.number().int(),
	//cover_image: z.string().url({ message: 'Invalid URL for cover image' }).nullable(),
	cover_image: z.string().nullable(),
	cost: z.coerce.number().positive(),
	enabled: z.boolean().default(true),
	productItems: z.array(z.lazy(() => productItemNewUpdateSchema)).optional()
});

// This type represents the inferred type from the schema
export type Product = z.infer<typeof productSchema>;

// This type represents the schema itself
export type ProductSchema = typeof productSchema;

// If you need a create schema without the id field
export const productNewUpdateSchema = productSchema.partial();
export type ProductNewUpdateType = z.infer<typeof productNewUpdateSchema>;

export const productItemSchema = z.object({
	id: z.number().int().positive().optional(),
	name: z.string().min(1, { message: 'Product item name is required' }),
	file_name: z.string().nullable(),
	download_url: z.string().nullable(),
	product_id: z.number().int().positive().optional(),
	file: z.instanceof(File).nullable() // Add this line to handle file uploads
});

export type ProductItem = typeof productItemSchema;
export type ProductItemSchema = z.infer<typeof productItemSchema>;

export const productItemNewUpdateSchema = productItemSchema.partial();
export type ProductItemNewUpdateType = z.infer<typeof productItemNewUpdateSchema>;
