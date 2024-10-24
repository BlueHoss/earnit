import { z } from 'zod';

export const publicProfileSchema = z.object({
	id: z.number().positive().int().optional(), // optional because it's auto-generated
	username: z.string(),
	ig_id: z.string(),
	pk_id: z.string(),
	private_profile: z.boolean(),
	registered_date: z.string().datetime(),
	last_checked: z.string().datetime()
});

// Type inference
export type PublicProfile = z.infer<typeof publicProfileSchema>;
