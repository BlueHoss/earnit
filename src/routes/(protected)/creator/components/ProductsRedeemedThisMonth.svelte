<script lang="ts">
	export let redeemedThisMonth;
	export let purchaseAmount;

	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import MarketplaceIcon from 'lucide-svelte/icons/store';
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Redeemed this Month</Card.Title>
		<MarketplaceIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold text-primary">{redeemedThisMonth}</div>
		<p class="text-xs text-muted-foreground flex items-center gap-2">
			<RewardCurrency amount={purchaseAmount} /> this month
		</p>
	</Card.Content>
</Card.Root>
