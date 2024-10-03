<script lang="ts">
	import Currency from '$lib/components/base/Currency.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import type { FollowerCreditBalanceDetail } from '$lib/schema/credit.schema';
	import { UsersIcon } from 'lucide-svelte';
	import CreatorSubscriptionCard from './CreatorSubscriptionCard.svelte';

	export let creditBalanceDetails: FollowerCreditBalanceDetail[];
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>Credits & Creators</Card.Title>
		<UsersIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each creditBalanceDetails as detail}
				<CreatorSubscriptionCard creator={detail} />
			{/each}
		</div>
	</Card.Content>
</Card.Root>
