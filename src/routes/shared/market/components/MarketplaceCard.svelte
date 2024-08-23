<script lang="ts">
	export let storeName;
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Card.Root
	class="max-w-xs overflow-hidden rounded-lg border border-gray-300 shadow-md hover:border-blue-500"
>
	<Card.Header class="p-0">
		<div class="relative h-32">
			<img
				src="/img/sample-market-img.webp"
				alt="Suzy's Profile"
				class="h-full w-full object-cover"
			/>
			<img
				src="/img/joe.webp"
				alt="Creator's Profile"
				class="absolute bottom-0 right-0 h-16 w-16 -translate-x-0.5 translate-y-1/2 transform rounded-full border-4"
			/>
		</div>
	</Card.Header>

	<Card.Content class=" p-4">
		<h3 class="text-lg font-bold">{storeName}</h3>
		<p class="text-sm text-gray-500">Facebook Add Professional</p>
		<p class="mt-2 text-gray-700">Helping businesses grow through Facebook Ads</p>
	</Card.Content>

	<Card.Footer class="flex justify-start space-x-4 p-4">
		<Button variant="link">View Store</Button>
	</Card.Footer>
</Card.Root>
