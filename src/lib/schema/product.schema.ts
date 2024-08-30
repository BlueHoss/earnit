import { z } from 'zod';

export const productSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1, { message: 'Product name is required' }),
	description: z.string().nullable(),
	creator_user_id: z.number().int(),
	//cover_image: z.string().url({ message: 'Invalid URL for cover image' }).nullable(),
	cover_image: z.string().nullable(),
	cost: z.coerce.number().positive(),
	enabled: z.boolean().default(true)
});

//age : z.preprocess((a) => parseInt(z.string().parse(a),10),
//z.number().gte(18, 'Must be 18 and above'))
//age: z.coerce.number().gte(18, 'Must be 18 and above');

// This type represents the inferred type from the schema
export type ProductType = z.infer<typeof productSchema>;
// This type represents the schema itself
export type ProductSchema = typeof productSchema;

// If you need a create schema without the id field
export const productNewUpdateSchema = productSchema.partial();
export type ProductNewUpdateType = z.infer<typeof productNewUpdateSchema>;

export const productItemSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1, { message: 'Product item name is required' }),
	download_url: z.string().url({ message: 'Invalid download URL' }).optional(),
	product_id: z.number().int().positive(),
	buyitnow_link: z.string().url({ message: 'Invalid buy it now link' }).optional()
});

export type ProductItemSchema = z.infer<typeof productItemSchema>;
