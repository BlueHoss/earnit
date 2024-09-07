<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import UsersIcon from 'lucide-svelte/icons/users';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
	import PageHeaderFollower from '$lib/components/FollowerPageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import Following from 'lucide-svelte/icons/square-user';
	import MarketCard from '$lib/components/base/MarketCard.svelte';
	import type { FollowerDashboardData } from '$lib/types/follower-dashboard.js';
	import SubscribeCard from './componenets/SubscribeCard.svelte';
	import FollowerCard from './componenets/FollowerCard.svelte';
	import SubscribeCard2 from './componenets/SubscribeCard2.svelte';

	export let data: FollowerDashboardData;
</script>

<PageWrapper>
	<PageHeaderFollower {data} Title="Dashboard" />
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Available Effort Credits</Card.Title>
				<CurrencyIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">{data.dashboard.availableCredits} Credits</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Subscriptions</Card.Title>
				<UsersIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">
					{data.dashboard.subscriptionCount} Creators
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Following</Card.Title>
				<Following class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">{data.dashboard.followingCount} Creators</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Redeemed</Card.Title>
				<CreditCardIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">{data.dashboard.creditsRedeemed} Credits</div>
			</Card.Content>
		</Card.Root>
	</div>
	<div>
		<Card.Root>
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Subscriptions ({data.dashboard.subscriberList.length})</Card.Title>
					<Card.Description>Creators you are subscribed</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid grid-cols-1 gap-2 sm:grid-cols-3">
				{#if data.dashboard.subscriberList.length === 0}
					<div class="text-center text-gray-400">No Subscriptions</div>
				{/if}

				{#each data.dashboard.subscriberList as subscriber}
					<!-- <SubscribeCard subscription={subscriber} /> -->
					<SubscribeCard2 subscription={subscriber} />
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
	<div>
		<Card.Root>
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Following ({data.dashboard.followerList.length})</Card.Title>
					<Card.Description>Creator you are following</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid grid-cols-1 gap-2 sm:grid-cols-3">
				{#if data.dashboard.subscriberList.length === 0}
					<div class="text-center text-gray-400">You are not following anyone, yet!</div>
				{/if}

				{#each data.dashboard.followerList as follower}
					<FollowerCard {follower} />
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
