import { z } from 'zod';

export const earnitScannerCreatorSchema = z.object({
	id: z.number().int().positive().optional(), // optional because it's auto-generated serial
	creator_user_id: z.number().int().positive({
		message: 'Creator user ID must be a positive integer'
	}),
	scanner_creator_id: z.number().int().positive(),
	date_added: z.date()
});

// Type inference
export type EarnitScannerCreator = z.infer<typeof earnitScannerCreatorSchema>;

// Schema for creating new records (without id as it's auto-generated)
export const createEarnitScannerCreatorSchema = earnitScannerCreatorSchema
	.omit({ id: true })
	.extend({
		date_added: z.date().default(() => new Date())
	});

// Schema for updating existing records
export const updateEarnitScannerCreatorSchema = earnitScannerCreatorSchema
	.partial()
	.omit({ id: true });
