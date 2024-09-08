<!-- Page Missions -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share';
	import FilmIcon from 'lucide-svelte/icons/film';
	import CommentIcon from 'lucide-svelte/icons/message-square-more';
	import FollowIcon from 'lucide-svelte/icons/user-round-check';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { DefaultMission } from '$lib/schema/mission.schema';
	import Mission from './Mission.svelte';

	interface PageData {
		missions: DefaultMission[];
	}

	export let data: PageData;
</script>

<PageWrapper>
	<h1 class="mb-2 text-2xl font-semibold">Earn It Merit Missions</h1>
	<div class="flex justify-center gap-4">
		{#each data.missions as mission}
			<Mission {mission} />
		{/each}
	</div>
</PageWrapper>
