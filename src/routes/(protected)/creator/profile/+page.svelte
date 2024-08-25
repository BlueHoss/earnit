<!-- Page Profile -->
<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import Handle from '$lib/components/base/Handle.svelte';

	export let data: PageData;
</script>

<PageWrapper>
	<div class="grid gap-4 p-6 md:grid-cols-1 lg:grid-cols-1">
		<!-- User Profile Card -->
		<Card.Root class="col-span-1">
			<Card.Content>
				<div class="flex flex-col items-center pt-3">
					<Avatar class="h-24 w-24">
						<AvatarImage src={data.user?.profile_pic} alt="Your Profile Picture" />
						<AvatarFallback>{data.user?.initials}</AvatarFallback>
					</Avatar>
				</div>
				<p class="mt-2 text-center italic text-gray-700">
					<Handle handle={data.user?.handle} />
				</p>

				<h2 class="mt-4 text-center text-xl font-bold">
					{data.user?.first_name}
					{data.user?.last_name}
				</h2>
				<p class="text-center text-red-500">{data.user?.title}</p>
				<p class="mt-2 text-center italic">
					"{data.user?.tag_line}"
				</p>
			</Card.Content>
		</Card.Root>

		<!-- Bio Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Bio</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>
					{data.bio.bio}
				</p>
			</Card.Content>
		</Card.Root>

		<div class="flex justify-end space-x-4">
			<a href="/creator/profile/edit">
				<Button class="w-full">Edit Profile</Button>
			</a>
		</div>
	</div>
</PageWrapper>
