import type { MissionAction } from '$lib/schema/mission.schema';

type CompositeKey = `${number}-${number}`;

export class MissionActionsCache {
	private cache: Map<CompositeKey, MissionAction[]> = new Map();

	private createKey(missionId: number, creatorId: number): CompositeKey {
		return `${missionId}-${creatorId}`;
	}

	set(missionId: number, creatorId: number, actions: MissionAction[]): void {
		const key = this.createKey(missionId, creatorId);
		this.cache.set(key, actions);
	}

	get(missionId: number, creatorId: number): MissionAction[] | undefined {
		const key = this.createKey(missionId, creatorId);
		return this.cache.get(key);
	}

	has(missionId: number, creatorId: number): boolean {
		const key = this.createKey(missionId, creatorId);
		return this.cache.has(key);
	}
}
