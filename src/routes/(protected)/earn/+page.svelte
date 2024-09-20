<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
	import PageHeaderFollower from '$lib/components/base/FollowerPageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { FollowerDashboardData } from '$lib/types/follower-dashboard.js';
	import AvailableCredits from './components/AvailableCredits.svelte';
	import Subscriptions from './components/Subscriptions.svelte';
	import MeritOfferingCardPurchased from '$lib/components/base/MeritOfferingCardPurchased.svelte';

	export let data: FollowerDashboardData;
</script>

<PageWrapper>
	<PageHeaderFollower {data} Title="Dashboard" />
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<AvailableCredits availableCredits={data.dashboard.availableCredits} user={data.user} />
		<Subscriptions
			subscriptionCount={data.dashboard.subscriptionCount}
			subscriberList={data.dashboard.subscriberList}
		/>

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
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Your products</Card.Title>
					<Card.Description>Your Merit Offerings redeemed with credits!</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{#each data.dashboard.productsPurchased as product}
					<a href="/earn/{product.id}">
						<MeritOfferingCardPurchased {product} />
					</a>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
