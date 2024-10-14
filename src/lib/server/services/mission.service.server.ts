import type { DefaultMission, MissionAction } from '$lib/schema/mission.schema';
import { and, eq, sum } from 'drizzle-orm';
import db from '../database/drizzle';
import {
	mission_action,
	mission_creator,
	mission_default_action,
	mission
} from '../database/schema';

async function updateMissionItemValue(
	missionActionId: number,
	missionActionValue: number
): Promise<MissionAction | null> {
	if (!missionActionId || missionActionValue < 0) {
		return null;
	}

	const result = await db
		.update(mission_action)
		.set({ reward_per_day: missionActionValue })
		.where(eq(mission_action.id, missionActionId))
		.returning();

	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
}

async function setMissionStatusForCreator(missionId: number, creatorId: number, enabled: boolean) {
	await db
		.update(mission_creator)
		.set({ enabled: enabled })
		.where(
			and(eq(mission_creator.mission_id, missionId), eq(mission_creator.creator_user_id, creatorId))
		)
		.returning();
}

async function getDefaultMissions(): Promise<DefaultMission[]> {
	const missions = await db
		.select({
			id: mission.id,
			name: mission.name,
			platform: mission.platform,
			description: mission.description
		})
		.from(mission);

	for (const mission of missions) {
		const actions = await db
			.select({
				id: mission_default_action.id,
				name: mission_default_action.name,
				description: mission_default_action.description,
				icon: mission_default_action.icon,
				reward_per_day: mission_default_action.reward_per_day
			})
			.from(mission_default_action)
			.where(eq(mission_default_action.mission_id, mission.id));

		mission.actions = actions;
	}

	return missions;
}

async function getDailyTotalMissionCredits(creatorId: number): Promise<number> {
	const total = await db
		.select({
			total: sum(mission_action.reward_per_day).as('total')
		})
		.from(mission_action)
		.where(eq(mission_action.creator_user_id, creatorId));

	if (total.length === 0) {
		return 0;
	} else {
		return Number(total[0].total);
	}
}

export const MissionService = {
	updateMissionItemValue,
	getDefaultMissions,
	setMissionStatusForCreator,
	getDailyTotalMissionCredits
};
