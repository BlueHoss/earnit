<script lang="ts">
	export let redeemedThisMonth;

	import * as Card from '$lib/components/ui/card/index.ts';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Redeemed this Month</Card.Title>
		<CreditCardIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold text-primary">{redeemedThisMonth}</div>
		<!-- <p class="text-xs text-muted-foreground">+119% from last month!</p> -->
	</Card.Content>
</Card.Root>
