import { z } from 'zod';

// Schema for mission_table
export const missionSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	description: z.string(),
	platform: z.string()
});

// Schema for mission_action_table
export const missionActionSchema = z.object({
	id: z.number().int().positive(),
	mission_id: z.number().int().positive(),
	name: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	reward_per_day: z.number().nonnegative(),
	creator_user_id: z.number().int().positive()
});

export type MissionSchema = typeof missionSchema;
export type Mission = z.infer<typeof missionSchema>;

export type MissionActionSchema = typeof missionActionSchema;
export type MissionAction = z.infer<typeof missionActionSchema>;

export const defaultMissionActionSchema = missionActionSchema.omit({
	creator_user_id: true,
	mission_id: true
});
export const defaultMissionSchema = missionSchema.extend({
	actions: z.array(defaultMissionActionSchema),
	enabled: z.boolean()
});

export type DefaultMission = z.infer<typeof defaultMissionSchema>;

export type DefaultMissionAction = z.infer<typeof defaultMissionActionSchema>;
