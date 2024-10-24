import { z } from 'zod';

// Schema for plan
export const planSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	description: z.string().nullable(),
	plan_percent: z.number(),
	plan_cost: z.number(),
	stripe_price_id: z.string().nullable(),
	level: z.number().int().positive()
});

export type Plan = z.infer<typeof planSchema>;

export const planWithSubscription = planSchema.partial().extend({
	creator_user_id: z.number().int().nullable(),
	follower_user_id: z.number().int().nullable(),
	date_started: z.string().datetime().nullable(),
	features: z.array(z.string()),
	currentPlan: z.boolean().nullable(),
	stripe_subscription_id: z.string().nullable()
});

export type PlanWithSubscription = z.infer<typeof planWithSubscription>;

export const planSubscriptionSchema = z.object({
	id: z.number().int().positive(),
	plan_id: z.number().int().positive(),
	creator_user_id: z.number().int(),
	follower_user_id: z.number().int(),
	date_started: z.string().datetime(),
	date_canceled: z.string().datetime().nullable(),
	stripe_subscription_id: z.string().nullable()
});

export type PlanSubscription = z.infer<typeof planSubscriptionSchema>;

export const planSubscriptionSchemaWithPercent = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	// plan_percent: z
	// 	.number()
	// 	.or(z.string())
	// 	.transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
	plan_percent: z.number()
});

export type PlanSubscriptionWithPercent = z.infer<typeof planSubscriptionSchemaWithPercent>;
