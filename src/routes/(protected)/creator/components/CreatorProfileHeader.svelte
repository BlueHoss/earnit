<!-- Creator Profile Header -->
<script lang="ts">
	import type { PageData } from '../$types';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import Handle from '$lib/components/base/Handle.svelte';
	import Number from '$lib/components/base/Number.svelte';

	export let data: PageData;
</script>

<!-- User Profile Card -->
<Card.Root class="col-span-1">
	<Card.Content class="flex h-32 items-center justify-between p-4">
		<!-- Left Section: Image and Text -->
		<div class="flex items-center space-x-4">
			<a href="/creator/profile/">
				<Avatar class="h-24 w-24">
					<AvatarImage src={data.user?.profile_pic} alt="Your Profile Picture" />
					<AvatarFallback>{data.user?.initials}</AvatarFallback>
				</Avatar>
			</a>
			<div class="flex flex-col justify-center">
				<Handle handle={data.user?.handle} />
				<p class="text-sm">{data.user?.title}</p>
				<p class="italic">{data.user?.tag_line}</p>
				<p><Number amount={data.user?.follower_count} /> social media followers</p>
			</div>
		</div>
		<!-- Vertical Line -->
		<div class="h-24 w-px bg-gray-700"></div>

		<!-- Right Section: Vertically Stacked Buttons -->
		<div class="flex flex-col space-y-2">
			<h1 class="text-2xl font-semibold">{data.user?.first_name} {data.user?.last_name}</h1>
		</div>
	</Card.Content>
</Card.Root>
