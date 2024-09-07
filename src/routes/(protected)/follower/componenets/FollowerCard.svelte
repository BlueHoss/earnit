<script lang="ts">
	import type { Follower } from '$lib/schema/follower_dashboard.schema';

	export let follower: Follower;
</script>

<a href="/public/market/{follower.creator_user_id}" class="block">
	<div
		class="flex items-center space-x-4 rounded-lg bg-primary-foreground p-4 shadow-md transition duration-300 hover:bg-muted"
	>
		<img
			src={follower.profile_pic}
			alt={follower.store_name}
			class="h-16 w-16 rounded-md object-cover"
		/>
		<div>
			<h3 class="text-lg font-semibold">{follower.store_name}</h3>
			<p class="text-sm text-gray-400">{follower.title}</p>
		</div>
	</div>
</a>
