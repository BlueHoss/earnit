<script>
	export let CardName = 'Unknown';
	export let EffortCredit = '0';

	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import CurrencyIcon from 'lucide-svelte/icons/currency';

	import { getUserRole } from '$lib/utils/auth';
	import Button from '../ui/button/button.svelte';

	var canEdit = false;
	function setPermission() {
		var role = getUserRole();

		if (role === 'creator') {
			canEdit = true;
		}
	}

	setPermission();
</script>

<Card class="overflow-hidden rounded-lg bg-gray-900 shadow-lg">
	<div class="relative">
		<img src="/img/facebook-course.png" alt={CardName} class="h-48 w-full object-cover" />
	</div>
	<CardContent class="p-4">
		<CardTitle class="flex justify-between text-xl font-semibold ">
			{CardName}
			{#if canEdit}
				<Button variant="link">
					<a href="/creator/marketplace/edit"><PencilIcon /></a>
				</Button>
			{/if}
		</CardTitle>
		<CardDescription class="mt-2 text-gray-400">
			<p class="mb-2">
				This is a detailed description of the product, explaining what it is, its features....
			</p>
			<div class="mt-2 flex justify-start text-gray-200">
				<CurrencyIcon class="mr-2" />
				{EffortCredit} Suzy Tokens
			</div>
		</CardDescription>
	</CardContent>
</Card>
