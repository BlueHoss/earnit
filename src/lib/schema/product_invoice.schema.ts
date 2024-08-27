// src/lib/schemas/productInvoiceSchema.ts

import { z } from 'zod';

export const productInvoiceSchema = z.object({
	id: z.number().int().positive(),
	product_id: z.number().int().positive(),
	cost: z.number().positive(),
	date_purchased: z.string().datetime(),
	follower_user_id: z.number().int().positive(),
	creator_user_id: z.number().int().positive()
});

export type ProductInvoice = z.infer<typeof productInvoiceSchema>;

// Optional: Create a schema for creating a new invoice (without id)
export const createProductInvoiceSchema = productInvoiceSchema.omit({ id: true });

// Optional: Create a schema for updating an invoice (all fields optional except id)
export const updateProductInvoiceSchema = productInvoiceSchema.partial().required({ id: true });

export type CreateProductInvoice = z.infer<typeof createProductInvoiceSchema>;
export type UpdateProductInvoice = z.infer<typeof updateProductInvoiceSchema>;

/**
 * Fetch product_invoice list from database
 *
 */
export const productInvoiceResultSchema = productInvoiceSchema.partial().extend({
	follower: z.string().optional().nullable(),
	product_name: z.string().optional().nullable(),
	handle: z.string().optional().nullable()
});
export type ProductInvoiceResult = z.infer<typeof productInvoiceResultSchema>;
