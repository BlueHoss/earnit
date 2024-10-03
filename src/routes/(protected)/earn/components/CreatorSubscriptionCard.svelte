<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { CreditCard, Users } from 'lucide-svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import DateFormatter from '$lib/components/base/DateFormatter.svelte';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';

	export let creator;
</script>

<Card.Root class="w-full">
	<Card.Header class="flex flex-row items-center space-x-4 pb-2">
		<Avatar class="h-12 w-12">
			<AvatarImage src={creator.profile_pic} alt={creator.store_name} />
			<AvatarFallback>{creator.store_name[0]}</AvatarFallback>
		</Avatar>
		<div class="flex-1">
			<Card.Title>{creator.store_name}</Card.Title>
			<Card.Description>{creator.reward_name}</Card.Description>
		</div>

		<Badge variant="secondary">
			{#if creator.plan_name}
				{creator.plan_name}
			{:else}
				Inactive
			{/if}
		</Badge>
	</Card.Header>
	<Card.Content>
		<div class="flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<RewardCurrency amount={creator.total_credits} name={creator.reward_name} />
			</div>
		</div>
		<div class="text-sm text-muted-foreground">
			Last reward: <DateFormatter date={creator.date} format="fromNow" />
		</div>
	</Card.Content>
	<hr />
	<Card.Footer class="flex justify-between pt-4">
		<Button href="/market/{creator.creator_user_id}" variant="outline" size="sm">
			<Users class="mr-2 h-4 w-4" />
			View Creator
		</Button>
		<Button href="/market/{creator.creator_user_id}/subscribe" size="sm">Manage Subscription</Button
		>
	</Card.Footer>
</Card.Root>
