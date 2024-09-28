<!-- Page Marketplace -->
<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import FollowEarnItIcon from 'lucide-svelte/icons/user-round-check';
	import PaidSubscribersIcon from 'lucide-svelte/icons/activity';
	import { pendingActions } from '$lib/stores/pending-action.store';
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import MeritOfferingCard from '$lib/components/base/MeritOfferingCard.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import MissionActions from '$lib/components/base/MissionActions.svelte';
	import { CheckCircle2, CurrencyIcon } from 'lucide-svelte';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import MarketplaceIcon from 'lucide-svelte/icons/store';
	import { Title } from '$lib/components/ui/alert';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import AlertTitle from '$lib/components/ui/alert/alert-title.svelte';
	import AlertDescription from '$lib/components/ui/alert/alert-description.svelte';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import { toast } from 'svelte-sonner';
	import SubscribeDialog from './components/SubscribeDialog.svelte';
	import UnsubscribeDialog from './components/UnsubscribeDialog.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let showNotSignedInDialog = false;
	let showSubscribeDialog = false;
	let showUnsubscribeDialog = false;

	export let data: PageData;

	let subscribed = data.creator.subscribers?.find((follower) => follower.id === data.user?.id)
		? true
		: false;

	function handleSubscribe() {
		if (!data || !data.user) {
			pendingActions.addAction({
				type: 'SUBSCRIBE_CREATOR',
				payload: { creatorId: data.creator.id }
			});

			showNotSignedInDialog = true;
			return;
		}

		showSubscribeDialog = true;
	}

	function handleUnsubscribe() {
		if (!data || !data.user) {
			pendingActions.addAction({
				type: 'SUBSCRIBE_CREATOR',
				payload: { creatorId: data.creator.id }
			});

			showNotSignedInDialog = true;
			return;
		}

		showUnsubscribeDialog = true;
	}
</script>

<PageWrapper>
	<div class="flex h-full items-center justify-between">
		<PageHeaderCreator user={data.creator} />

		<!-- Right Section: Follow Button -->
		<div class="flex flex-col space-y-2">
			{#if subscribed}
				<Button on:click={handleUnsubscribe} class="px-6"
					><PaidSubscribersIcon class="pr-1" />Modify your Earning Level</Button
				>
			{:else}
				<Button on:click={() => handleSubscribe()} class="px-6"
					><PaidSubscribersIcon class="pr-1" />Become an Earner</Button
				>
			{/if}
		</div>
		<!-- <Badge class="bg-primary text-white">Earn It</Badge> -->
	</div>

	{#if data.user}
		<Title class="text-left">Your credit and purchase history for this creator</Title>
		<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">
						{data.creator.reward_name} Credits Available</Card.Title
					>
					<CurrencyIcon class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold text-primary">
						<RewardCurrency amount={data.followerCredits} />
					</div>
					<p class="text-xs text-muted-foreground">
						Amount of {data.creator.reward_name} you have with {data.creator.store_name}.
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Your Redeemed Products</Card.Title>
					<MarketplaceIcon class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold text-primary">{data.followerPurchases}</div>
					<p class="text-xs text-muted-foreground flex items-center gap-2">
						Offerings you have redeemed from this creator.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	{:else if !data.user || data.followerCredits === 0}
		<Alert variant="default" class="mt-4">
			<CheckCircle2 class="h-4 w-4" />
			<AlertTitle>No Credits found</AlertTitle>
			<AlertDescription
				>You do not have any credit with {data.creator.store_name} check out their missions below</AlertDescription
			>
		</Alert>
	{/if}
	<div>
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>{data.creator.store_name}'s Merit Offerings</Card.Title>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{#each data.products as product}
					<a href="/market/{data.creator.id}/offering/{product.id}">
						<MeritOfferingCard user={data.creator} {product} />
					</a>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
	<div class="grid gap-4 md:gap-8">
		<Card.Root>
			<Card.Header>
				<Card.Title>{data.creator.store_name}'s Instagram Merit Mission</Card.Title>
				<Card.Description
					>{data.creator.store_name} has created a mission for you to complete on Instagram
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<MissionActions user={null} missionActions={data.missionActions} />
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>

<SubscribeDialog user={data.user} bind:showSubscribeDialog bind:creator={data.creator} />

<UnsubscribeDialog user={data.user} bind:showUnsubscribeDialog bind:creator={data.creator} />

<Dialog.Root bind:open={showNotSignedInDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Please Sign In or Sign Up</Dialog.Title>
			<Dialog.Description
				>In order to become an Earner of {data.creator.store_name} please sign in or sign up.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<Button on:click={() => goto('/auth/sign-up?user_type=follower')} class="w-full"
				>Sign Up</Button
			>
			<Button on:click={() => goto('/auth/sign-in')}>Sign In</Button>
		</div>
		<Dialog.Footer>
			<Button on:click={() => (showNotSignedInDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
