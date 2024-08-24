<script lang="ts">
	export let effortCredits;

	import * as Card from '$lib/components/ui/card/index.ts';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Available Effort Credits</Card.Title>
		<CurrencyIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold text-primary">{effortCredits}</div>
		<!-- <p class="text-xs text-muted-foreground">+20.1% from last month</p> -->
	</Card.Content>
</Card.Root>
