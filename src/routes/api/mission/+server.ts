import { MissionService } from '$lib/server/services/mission.service.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	MissionService.setMissionStatusForCreator(data.missionId, data.creatorId, data.enabled);
	// Process the action
	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
