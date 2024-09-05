import type { MissionAction } from '$lib/schema/mission.schema';
import { eq } from 'drizzle-orm';
import db from '../database/drizzle';
import { mission_action_table } from '../database/schema';

async function updateMissionItemValue(
	missionActionId: number,
	missionActionValue: number
): Promise<MissionAction | null> {
	if (!missionActionId || missionActionValue < 0) {
		return null;
	}

	const result = await db
		.update(mission_action_table)
		.set({ reward_per_day: missionActionValue })
		.where(eq(mission_action_table.id, missionActionId))
		.returning();

	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

export const MissionService = {
	updateMissionItemValue
};
