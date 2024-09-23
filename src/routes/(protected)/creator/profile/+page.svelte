<!-- Page Profile -->
<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let data: PageData;
</script>

<PageWrapper>
	<div class="grid gap-4 p-6 md:grid-cols-1 lg:grid-cols-1">
		<PageHeaderCreator user={data.user} />
		<Card.Root>
			<Card.Header>
				<Card.Title
					><h1 class="text-2xl font-semibold">{data.user?.first_name}'s Profile</h1></Card.Title
				>
			</Card.Header>
			<Card.Content>
				<Label>First Name: {data.user?.first_name}</Label>
				<p></p>
				<Label>Last Name: {data.user?.last_name}</Label>
				<p></p>
				<Label>Instagram Handle: {data.user?.social_media_profile}</Label>
			</Card.Content>
		</Card.Root>

		<div class="flex justify-end space-x-4">
			<a href="/creator/profile/edit">
				<Button class="w-full">Edit Profile</Button>
			</a>
		</div>
	</div>
</PageWrapper>
