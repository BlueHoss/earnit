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
	<div class="grid gap-4 p-6 sm:grid-cols-1">
		<!-- Profile Card -->
		<Card.Root class="col-span-1">
			<Card.Content class="flex h-32 items-center justify-between p-4">
				<!-- Left Section: Image and Text -->
				<div class="flex items-center space-x-4">
					<Avatar class="h-24 w-24">
						<AvatarImage src="/img/joe.webp" alt="Joe Burns' Profile Picture" />
						<AvatarFallback>JB</AvatarFallback>
					</Avatar>
					<div class="flex flex-col justify-center">
						<h2 class="text-xl font-bold">Joe Burns</h2>
						<p class="text-sm">The man!</p>
					</div>
				</div>

				<!-- Vertical Line -->
				<div class="h-24 w-px bg-gray-700"></div>

				<!-- Right Section: Dashboard Button -->
				<div class="flex items-center">
					<a href="/follower/">
						<Button>Dashboard</Button>
					</a>
				</div>
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
			<a href="/follower/profile/edit">
				<Button class="w-full">Edit Profile</Button>
			</a>
		</div>
	</div>
</PageWrapper>
