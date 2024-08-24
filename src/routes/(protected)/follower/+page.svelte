<script>
	export let data;

	import * as Card from '$lib/components/ui/card/index.ts';
	import UsersIcon from 'lucide-svelte/icons/users';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
	import * as Table from '$lib/components/ui/table/index.ts';
	import PageHeaderFollower from '$lib/components/FollowerPageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import Following from 'lucide-svelte/icons/square-user';
	import MarketCard from '$lib/components/base/MarketCard.svelte';
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
				<div class="text-2xl font-bold text-primary">2</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Subscriptions</Card.Title>
				<UsersIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">2 Creators</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Following</Card.Title>
				<Following class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">12 Creators</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Redeemed</Card.Title>
				<CreditCardIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">12 Rewards</div>
			</Card.Content>
		</Card.Root>
	</div>
	<div>
		<Card.Root>
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Subscribed</Card.Title>
					<Card.Description>Creators you are subscribed</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid grid-cols-1 gap-2 sm:grid-cols-3">
				<MarketCard storeName="Stephanie" storeTitle="Secrets to deep work" />
				<MarketCard storeName="Sara" storeTitle="Funding your wife's habits" />
			</Card.Content>
		</Card.Root>
	</div>
	<div>
		<Card.Root>
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Following</Card.Title>
					<Card.Description>Creator you are following</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid grid-cols-1 gap-2 sm:grid-cols-3">
				<MarketCard storeName="Suzy" storeTitle="Facebook Add Professional" />
				<MarketCard storeName="Greg" storeTitle="PDF Mania" />
				<MarketCard storeName="Frank" storeTitle="How to raise cats" />
				<MarketCard storeName="Stephanie" storeTitle="Secrets to deep work" />
				<MarketCard storeName="Sara" storeTitle="Funding your wife's habits" />
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
