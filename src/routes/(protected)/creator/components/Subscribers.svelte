<script lang="ts">
	export let subscriberCount;

	import * as Card from '$lib/components/ui/card/index.ts';
	import PaidSubscribersIcon from 'lucide-svelte/icons/activity';
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Subscribers</Card.Title>
		<PaidSubscribersIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold text-primary">{subscriberCount}</div>
	</Card.Content>
</Card.Root>
