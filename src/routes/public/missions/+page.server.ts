import { MissionService } from '$lib/server/services/mission.service.server.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const missions = await MissionService.getDefaultMissions();
	return {
		missions
	};
};
