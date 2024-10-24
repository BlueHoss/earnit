import { z } from 'zod';

export const userPostCheckStatusSchema = z.object({
	id: z.number().int().positive(),
	checked: z.boolean().nullable(),
	follower: z.boolean().nullable(),
	liker: z.boolean().nullable(),
	commenter: z.boolean().nullable(),
	post_id: z.number().int().positive(),
	user_id: z.number().int().positive()
});

// If you need a schema for creating/updating without ID
export const userPostCheckStatusCreateSchema = userPostCheckStatusSchema.omit({ id: true });

// If you need a type from the schema
export type UserPostCheckStatus = z.infer<typeof userPostCheckStatusSchema>;
