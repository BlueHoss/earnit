import { z } from 'zod';

const DistributionStatusEnum = z.enum(['running', 'completed', 'failed']);
export type DistributionStatus = z.infer<typeof DistributionStatusEnum>;

export const rewardDistributionSchema = z.object({
	id: z.number().int().positive(),
	date_ran: z.string().date(),
	actions_processed: z.number().int(),
	status: DistributionStatusEnum.default('running').transform((val) => val as string)
});

export type RewardDistribution = z.infer<typeof rewardDistributionSchema>;
