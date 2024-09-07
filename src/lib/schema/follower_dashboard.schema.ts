import { z } from 'zod';

// Schema for mission_action_table
export const subscriberListSchema = z.object({
	creator_user_id: z.number().nullable(),
	store_name: z.string().nullable(),
	title: z.string().nullable(),
	follower_count: z.number(),
	profile_pic: z.string().nullable(),
	date_started: z.string().nullable(),
	name: z.string(),
	plan_cost: z.string()
});

export type Subsciption = z.infer<typeof subscriberListSchema>;

// Schema for mission_action_table
export const followerListSchema = z.object({
	store_name: z.string().nullable(),
	title: z.string().nullable(),
	creator_user_id: z.number().nullable(),
	profile_pic: z.string().nullable()
});

export type Follower = z.infer<typeof followerListSchema>;
