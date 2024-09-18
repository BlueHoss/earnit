import { z } from 'zod';

export const creditDistributed = z.object({
	date: z.date(),
	amount: z.string(),
	transaction_type: z.string().nullable(),
	to_user: z.string()
});

export type CreditDistributed = z.infer<typeof creditDistributed>;

export const followerCreditBalanceDetail = z.object({
	date: z.date(),
	balance: z.number(),
	store_name: z.string(),
	creator_user_id: z.number(),
	reward_name: z.string()
});

export type FollowerCreditBalanceDetail = z.infer<typeof followerCreditBalanceDetail>;
