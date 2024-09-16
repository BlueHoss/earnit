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
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { Title } from '$lib/components/ui/alert';

	interface PageData {
		missions: DefaultMission[];
	}

	export let data: PageData;
</script>

<PageWrapper>
	<h1 class="mb-2 text-2xl font-semibold">Earn It Merit Missions</h1>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div class="flex items-center gap-x-2">
					<CurrencyIcon /> Learn how to earn credits
				</div>
			</Card.Title>
			<Card.Description
				>Earn Credits by performing actions on specific Creator social media profiles.</Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-8">
			<p>
				Earn It is a platform that allows you to earn credits by performing actions on specific
				Creator social media profiles.
			</p>
			<p>
				These actions can include liking a post, sharing a post, following a Creator, and more. Once
				you have earned enough credits, you can redeem them for products or services offered by the
				Creator. The more credits you earn, the more items you can redeem. Here are some of the
				missions you can complete to earn credits:
			</p>

			<Title>How to get started:</Title>
			<ol>
				<li>Find a Creator that uses Earn It.</li>
				<li>Follow this Creator both on social media and here on Earn It.</li>
				<li>Perform any of the missions listed below to earn credits.</li>
			</ol>
		</Card.Content>
	</Card.Root>
	<div class="flex justify-center gap-4">
		{#each data.missions as mission}
			<Mission {mission} />
		{/each}
	</div>
</PageWrapper>

<style>
	/* Scoped styles */
	ol {
		/* Reset the list-style to show numbers */
		list-style-type: decimal;

		/* Ensure the numbers are visible */
		padding-left: 1.5em;
	}

	/* If the global styles are using !important, you might need to use it too */
	ol {
		list-style-type: decimal !important;
	}

	/* If you need to target list items specifically */
	ol li {
		display: list-item !important;
	}

	/* You might also need to reset the counter */
	ol {
		counter-reset: list-counter;
	}
	ol li {
		counter-increment: list-counter;
	}
</style>
