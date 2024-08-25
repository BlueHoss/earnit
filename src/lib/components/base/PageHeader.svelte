<script>
	export let Title = 'Marketplace';
	export let data;

	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import Number from './Number.svelte';
	import Handle from './Handle.svelte';
</script>

<div class="flex items-center justify-between space-x-4">
	<div class="flex items-center space-x-4">
		<Avatar style="height: 5rem; width: 5rem;">
			<AvatarImage src={data.user?.profile_pic} alt="Suzy's Profile Picture" />
			<AvatarFallback>{data.user?.initials}</AvatarFallback>
		</Avatar>
		<div>
			<h1 class="text-2xl font-semibold">{data.user?.first_name}'s {Title}</h1>
			<p>
				<Handle handle={data.user?.handle} />
			</p>
			<p class="text-sm text-gray-400">
				<Number amount={data.user?.follower_count} /> social media followers
			</p>
		</div>
	</div>
</div>

<style>
	.flex {
		display: flex;
	}

	.items-center {
		align-items: center;
	}

	.space-x-4 {
		margin-right: 1rem;
	}

	.font-semibold {
		font-weight: 600;
	}

	.text-gray-400 {
		color: #9ca3af;
	}

	.text-sm {
		font-size: 0.875rem;
	}
</style>
