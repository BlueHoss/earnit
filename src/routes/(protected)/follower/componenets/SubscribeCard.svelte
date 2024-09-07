<script lang="ts">
	import Currency from '$lib/components/base/Currency.svelte';
	import Number from '$lib/components/base/Number.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { Subsciption } from '$lib/schema/follower_dashboard.schema';

	export let subscription: Subsciption;
</script>

<a href="/public/market/{subscription.creator_user_id}" class="block">
	<div
		class="flex items-center space-x-4 rounded-lg bg-primary-foreground p-4 shadow-md transition duration-300 hover:bg-muted"
	>
		<img
			src={subscription.profile_pic}
			alt={subscription.store_name}
			class="h-16 w-16 rounded-md object-cover"
		/>
		<div>
			<h3 class="text-lg pb-2 font-semibold">{subscription.store_name}</h3>
			<p class="text-sm">
				{subscription.title}
			</p>
			<div class="flex items-center justify-between space-x-2">
				<div>
					<span class="text-sm font-semibold text-primary"
						><Currency amount={subscription.plan_cost} /></span
					>
					<span class="text-sm">/ month</span>
				</div>
				<Badge>
					{subscription.name}
				</Badge>
			</div>
		</div>
	</div>
</a>
