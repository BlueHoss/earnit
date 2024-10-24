import { z } from 'zod';

export const userToCheckSchema = z.object({
	id: z.number(),
	checked: z.boolean().nullable(),
	follower: z.boolean().nullable(),
	liker: z.boolean().nullable(),
	commenter: z.boolean().nullable(),
	post_id: z.number(),
	user_id: z.number()
});

// Type inference
export type UserToCheck = z.infer<typeof userToCheckSchema>;
