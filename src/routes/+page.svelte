<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { goto } from '$app/navigation';

	function redirect() {
		goto('/auth/sign-in');
	}
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header></Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<h1>Welcome to Earn It</h1>
			<Button on:click={redirect}>Sign In</Button>
		</div>
	</Card.Content>
</Card.Root>
