<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import FollowerIcon from 'lucide-svelte/icons/venetian-mask';
	import CreatorIcon from 'lucide-svelte/icons/tv-minimal-play';
	import SignoutButton from '$lib/components/base/SignOutButton.svelte';
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Select Your Role</Card.Title>
		<Card.Description>
			<p>It appears you are both a Creator and a Follower. Please select your role to continue.</p>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<a href="/creator">
				<Button class="w-full"><CreatorIcon class="pr-1" /> Continue as Creator</Button>
			</a>
			<a href="/follower">
				<Button variant="secondary" class="w-full"
					><FollowerIcon class="pr-1" /> Continue as Follower</Button
				>
			</a>
		</div>
		<div class="mt-4 text-center text-sm">
			<!-- <form method="POST" action="/auth/sign-out">
				<Button type="submit">Sign Out</Button>
			</form> -->

			Sign in with a different account?
			<SignoutButton />
		</div>
	</Card.Content>
</Card.Root>
