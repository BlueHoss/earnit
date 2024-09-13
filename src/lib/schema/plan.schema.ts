import { z } from 'zod';

// Schema for plan
export const planSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	description: z.string().nullable(),
	plan_percent: z.string(),
	plan_cost: z.string()
});

export type Plan = z.infer<typeof planSchema>;

export const planSubscriptionSchema = z.object({
	id: z.number().int().positive(),
	plan_id: z.number().int().positive(),
	creator_user_id: z.number().int(),
	follower_user_id: z.number().int(),
	date_started: z.string().datetime(),
	date_canceled: z.string().datetime().nullable()
});

export type PlanSubscription = z.infer<typeof planSubscriptionSchema>;
