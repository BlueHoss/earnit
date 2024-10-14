<script lang="ts">
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Confetti } from 'svelte-confetti';
	import { onMount } from 'svelte';

	export let data;

	let showConfetti = false;

	onMount(() => {
		showConfetti = true;
		setTimeout(() => (showConfetti = false), 5000); // Stop confetti after 5 seconds
	});
</script>

<PageWrapper>
	<PageHeaderCreator user={data.creator} />

	<Card.Root class="text-center">
		<Card.Header>
			<Card.Title class="text-3xl font-bold text-primary">🎉 Congratulations! 🎉</Card.Title>
			<Card.Description class="text-xl mt-2">
				You're now a valued member of {data.creator.store_name}'s community!
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-8">
			<p class="text-lg">
				Woohoo! Your subscription to <span class="font-semibold">{data.creator.store_name}</span> is
				now active. Get ready for an amazing journey filled with exclusive content and incredible benefits!
			</p>
			<div class="bg-primary/10 p-4 rounded-lg">
				<h3 class="text-xl font-semibold mb-2">What's next?</h3>
				<ul class="list-disc list-inside text-left">
					<li>
						<a href="/earn">Explore your new access to premium content</a>
					</li>
					<li><a href="/">Connect with other community members</a></li>
					<li>Stay tuned to your email and our socials exclusive updates and offers</li>
				</ul>
			</div>
			<p class="text-primary font-semibold text-lg">
				We're thrilled to have you on board. Let the adventure begin!
			</p>
		</Card.Content>
	</Card.Root>

	{#if showConfetti}
		<div class="fixed top-0 left-0 w-full h-full pointer-events-none">
			<Confetti
				x={[-5, 10]}
				y={[0, 0.1]}
				delay={[0, 2000]}
				infinite
				duration={3000}
				amount={500}
				fallDistance="100vh"
			/>
		</div>
	{/if}
</PageWrapper>
