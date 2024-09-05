<script>
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import Number from './Number.svelte';
	import Handle from './Handle.svelte';

	export let Title = 'Marketplace';
	export let user;
</script>

<div class="flex items-center justify-between space-x-4">
	<div class="flex items-center space-x-4">
		<a href="/creator/profile/">
			<Avatar style="height: 6rem; width: 6rem;">
				<AvatarImage src={user.profile_pic} alt="Suzy's Profile Picture" />
				<AvatarFallback>{user.initials}</AvatarFallback>
			</Avatar>
		</a>
		<div class="flex flex-col justify-center">
			<h1 class="text-2xl font-semibold">{user.first_name}'s {Title}</h1>
			<Handle handle={user.handle} />
			<p class="text-sm">{user.title}</p>
			<p><Number amount={user.follower_count} /> social media followers</p>
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

	.text-sm {
		font-size: 0.875rem;
	}
</style>
