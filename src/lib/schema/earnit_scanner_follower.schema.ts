import { z } from 'zod';

export const earnitScannerFollowerSchema = z.object({
	id: z.number().int().positive().optional(), // optional because it's auto-generated serial
	follower_user_id: z.number().int().positive({
		message: 'Follower user ID must be a positive integer'
	}),
	scanner_follower_id: z.number().int().positive(),
	date_added: z.date()
});

// Type inference
export type EarnitScannerFollower = z.infer<typeof earnitScannerFollowerSchema>;

// Schema for creating new records (without id as it's auto-generated)
export const createEarnitScannerFollowerSchema = earnitScannerFollowerSchema
	.omit({ id: true })
	.extend({
		date_added: z.date().default(() => new Date())
	});

// Schema for updating existing records
export const updateEarnitScannerFollowerSchema = earnitScannerFollowerSchema
	.partial()
	.omit({ id: true });
