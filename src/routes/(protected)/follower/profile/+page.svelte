<!-- Page Profile -->
<script>
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import PageHeaderFollower from '$lib/components/base/FollowerPageHeader.svelte';

	export let data;
</script>

<PageWrapper>
	<!-- <div>
		{JSON.stringify(data)}
	</div> -->
	<div class="grid gap-4 p-6 sm:grid-cols-1">
		<!-- Profile Card -->
		<Card.Root class="col-span-1">
			<Card.Content class="flex h-32 items-center justify-between p-4">
				<!-- Left Section: Image and Text -->
				<div class="flex items-center space-x-4">
					<PageHeaderFollower {data} Title="Profile" />
					<div class="flex flex-col justify-center">
						<h2 class="text-xl font-bold">{data.user.first_name}</h2>
						<p class="text-sm">{data.user.handle}</p>
					</div>
				</div>

				<!-- Vertical Line -->
				<div class="h-24 w-px bg-gray-700"></div>

				<!-- Right Section: Dashboard Button -->
				<div class="flex items-center">
					<a href="/earn/">
						<Button>Dashboard</Button>
					</a>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="flex justify-end space-x-4">
			<a href="/follower/profile/edit">
				<Button class="w-full">Edit Profile</Button>
			</a>
		</div>
	</div>
</PageWrapper>
