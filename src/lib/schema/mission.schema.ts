import { z } from 'zod';

// Schema for mission_table
export const missionSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	platform: z.string()
});

// Schema for mission_action_table
export const missionActionSchema = z.object({
	id: z.number().int().positive(),
	mission_id: z.number().int().positive(),
	name: z.string(),
	reward_per_day: z.number().nonnegative(),
	creator_user_id: z.number().int().positive()
});

export type MissionSchema = typeof missionSchema;
export type Mission = z.infer<typeof missionSchema>;

export type MissionActionSchema = typeof missionActionSchema;
export type MissionAction = z.infer<typeof missionActionSchema>;
