<script lang="ts">
	import Currency from '$lib/components/base/Currency.svelte';
	import Number from '$lib/components/base/Number.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { Subsciption } from '$lib/schema/follower_dashboard.schema';
	import { User } from 'lucide-svelte';

	export let subscription: Subsciption;
</script>

<a href="/public/market/{subscription.creator_user_id}" class="block">
	<div class="rounded-lg bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
		<div class="p-4 sm:p-6">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center space-x-4">
					<div class="relative">
						<img
							src={subscription.profile_pic}
							alt={subscription.store_name}
							class="h-16 w-16 rounded-full object-cover border-2 border-primary"
						/>
						<Badge class="absolute bottom-0 right-0 text-xs" variant="secondary">
							{subscription.name}
						</Badge>
					</div>
					<div>
						<h3 class="text-xl font-bold">{subscription.store_name}</h3>
						<p class="text-sm text-muted-foreground">{subscription.title}</p>
					</div>
				</div>
				<div class="text-right">
					<p class="text-2xl font-bold text-primary">
						<Currency amount={subscription.plan_cost} />
					</p>
					<p class="text-sm text-muted-foreground">per month</p>
				</div>
			</div>
			<div class="flex items-center text-sm text-muted-foreground">
				<User size={16} class="mr-2" />
				<span><Number value={subscription.follower_count} /> followers</span>
			</div>
		</div>
	</div>
</a>
