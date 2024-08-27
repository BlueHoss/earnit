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
	import Number from '$lib/components/base/Number.svelte';
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import CreatorProfileHeader from '../components/CreatorProfileHeader.svelte';

	export let data: PageData;
</script>

<PageWrapper>
	<div class="grid gap-4 p-6 md:grid-cols-1 lg:grid-cols-1">
		<CreatorProfileHeader {data} />

		<!-- Bio Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title
					><h1 class="text-2xl font-semibold">{data.user?.first_name}'s Bio</h1></Card.Title
				>
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
