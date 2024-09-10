import type { DefaultMission, MissionAction } from '$lib/schema/mission.schema';
import { and, eq } from 'drizzle-orm';
import db from '../database/drizzle';
import {
	mission_action_table,
	mission_creator_table,
	mission_default_action_table,
	mission_table
} from '../database/schema';

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

async function setMissionStatusForCreator(missionId: number, creatorId: number, enabled: boolean) {
	await db
		.update(mission_creator_table)
		.set({ enabled: enabled })
		.where(
			and(
				eq(mission_creator_table.mission_id, missionId),
				eq(mission_creator_table.creator_user_id, creatorId)
			)
		)
		.returning();
}

async function getDefaultMissions(): Promise<DefaultMission[]> {
	const missions = await db
		.select({
			id: mission_table.id,
			name: mission_table.name,
			platform: mission_table.platform,
			description: mission_table.description
		})
		.from(mission_table);

	for (const mission of missions) {
		const actions = await db
			.select({
				id: mission_default_action_table.id,
				name: mission_default_action_table.name,
				description: mission_default_action_table.description,
				icon: mission_default_action_table.icon,
				reward_per_day: mission_default_action_table.reward_per_day
			})
			.from(mission_default_action_table)
			.where(eq(mission_default_action_table.mission_id, mission.id));

		mission.actions = actions;
	}

	return missions;
}

export const MissionService = {
	updateMissionItemValue,
	getDefaultMissions,
	setMissionStatusForCreator
};
