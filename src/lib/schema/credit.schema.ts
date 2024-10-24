import { z } from 'zod';

export const creditDistributed = z.object({
	date: z.date(),
	amount: z.string(),
	transaction_type: z.string().nullable(),
	to_user: z.string()
});

export type CreditDistributed = z.infer<typeof creditDistributed>;

export const followerCreditBalanceDetail = z.object({
	creator_user_id: z.number().nullable(),
	reward_name: z.string().nullable(),
	profile_pic: z.string().nullable(),
	store_name: z.string().nullable(),
	social_media_profile: z.string().nullable(),
	total_credits: z.number(),
	//date: z.date().nullable(),
	plan_name: z.string().nullable()
});

export type FollowerCreditBalanceDetail = z.infer<typeof followerCreditBalanceDetail>;
