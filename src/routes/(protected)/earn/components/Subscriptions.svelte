<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import UsersIcon from 'lucide-svelte/icons/users';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import SimpleDialog from '../../../components/SimpleDialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { User } from 'lucia';
	import SubscribeCard from './SubscribeCard.svelte';

	export let subscriptionCount = 0;
	export let subscriberList;

	let showDialog = false;
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Subscriptions</Card.Title>
		<UsersIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<Button variant="link" on:click={() => (showDialog = true)}>
			<div class="text-2xl font-bold text-primary">
				{subscriptionCount} Creators
			</div>
		</Button>
	</Card.Content>
</Card.Root>

<SimpleDialog
	bind:showDialog
	title="Subscription List"
	description="See your list creators you are Earning credits below"
>
	{#if subscriberList.length === 0}
		<div class="text-center text-gray-400">No subscriptions yet</div>
	{/if}

	{#each subscriberList as subscriber}
		<SubscribeCard subscription={subscriber} />
		<!-- <SubscribeCard2 subscription={subscriber} /> -->
	{/each}
</SimpleDialog>
