import { and, eq } from 'drizzle-orm';
import db from '$lib/server/database/drizzle';
import { mission_action, mission } from '../database/schema';
import type { Mission, MissionAction } from '$lib/schema/mission.schema';

async function getMissionActions(missionId: number, creatorId: number): Promise<MissionAction[]> {
	const where = and(
		eq(mission_action.mission_id, missionId),
		eq(mission_action.creator_user_id, creatorId)
	);

	const missionActions = await db.select().from(mission_action).where(where);

	return missionActions;
}

async function getMissions(): Promise<Mission[]> {
	return await db.select().from(mission);
}

async function getMissionByName(name: string): Promise<Mission | null> {
	const where = eq(mission.platform, name.toLowerCase());

	const missions = await db.select().from(mission).where(where);

	return missions.length > 0 ? missions[0] : null;
}

/**
 * Used to get the first mission action for a creator but this is TEMPORARY!
 * @param creatorId
 * @returns
 */
async function getFirstMissionAction(creatorId: number): Promise<MissionAction | null> {
	const where = eq(mission_action.creator_user_id, creatorId);

	const missionActions = await db.select().from(mission_action).where(where).limit(1);

	return missionActions.length > 0 ? missionActions[0] : null;
}

export const MissionRepository = {
	getMissionActions,
	getMissions,
	getFirstMissionAction,
	getMissionByName
};
