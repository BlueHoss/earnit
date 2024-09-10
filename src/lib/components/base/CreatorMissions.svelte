<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import type { DefaultMission } from '$lib/schema/mission.schema';
	import type { User } from 'lucia';
	import MissionActions from './MissionActions.svelte';
	import Switch from '../ui/switch/switch.svelte';

	export let missions: DefaultMission[] = [];
	export let user: User;

	// function handleMissionStatusChange(mission: DefaultMission) {
	// 	console.log('Mission change', mission.id, mission.enabled);
	// }

	// async function setMissionStatus(missionId: number, enabled: boolean) {
	// 	const response = await fetch('/api/mission-action', {
	// 		method: 'POST',
	// 		body: JSON.stringify({
	// 			missionId: missionId,
	// 			creatorId: user.id,
	// 			enabled: enabled
	// 		})
	// 	});
	// }
</script>

<div class="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-2">
	{#each missions as mission}
		<Card.Root>
			<Card.Header>
				<Card.Title>{mission.name}</Card.Title>
				<Card.Description>{mission.description}</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<MissionActions {user} missionActions={mission.actions} />
			</Card.Content>
		</Card.Root>
	{/each}
</div>
