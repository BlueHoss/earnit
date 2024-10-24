import { z } from 'zod';

export const followerActionSchema = z.object({
	id: z.number().int().positive(),
	creator_user_id: z.number().int().positive(),
	follower_user_id: z.number().int().positive(),
	mission_action_id: z.number().int().positive(),
	credits: z.string(),
	status: z.enum(['Pending', 'Failed']).default('Pending'),
	error_message: z.string().nullable(),
	date_added: z.string().datetime()
});

// Type inference
export type FollowerAction = z.infer<typeof followerActionSchema>;

// Schema for creating a new follower action (without id)
export const createFollowerActionSchema = followerActionSchema
	.omit({
		id: true,
		error_message: true
	})
	.extend({
		date_added: z
			.string()
			.datetime()
			.default(() => new Date().toUTCString())
	});

export type FollowerActionInsert = z.infer<typeof createFollowerActionSchema>;
