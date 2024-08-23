<!-- Page Profile -->
<script>
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Progress } from '$lib/components/ui/progress/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
</script>

<PageWrapper>
	<div class="grid gap-4 p-6 md:grid-cols-1 lg:grid-cols-1">
		<!-- User Profile Card -->
		<Card.Root class="col-span-1">
			<Card.Content>
				<div class="flex flex-col items-center pt-3">
					<Avatar class="h-24 w-24">
						<AvatarImage src="/img/suzy.webp" alt="Suzy's Profile Picture" />
						<AvatarFallback>SM</AvatarFallback>
					</Avatar>
				</div>
				<h2 class="mt-4 text-center text-xl font-bold">Suzy Mcleann</h2>
				<p class="text-center text-red-500">Facebook Add Professional</p>
				<p class="mt-2 text-center italic text-gray-700">
					"Helping businesses grow through Facebook Ads"
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
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam laborum voluptatibus
					quaerat officiis neque ipsum soluta omnis numquam dolores. Dicta totam atque nostrum
					labore nemo a minima fugit. Quasi, sapiente.
				</p>
			</Card.Content>
		</Card.Root>

		<div class="flex justify-end space-x-4">
			<a href="/profile/edit">
				<Button class="w-full">Edit Profile</Button>
			</a>
		</div>
	</div>
</PageWrapper>
