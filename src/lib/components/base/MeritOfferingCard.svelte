<script lang="ts">
	export let product: Product;
	export let data;
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import CurrencyIcon from 'lucide-svelte/icons/currency';

	import { getUserRole } from '$lib/utils/auth';
	import Button from '../ui/button/button.svelte';
	import type { Product } from '$lib/schema/product.schema';

	var canEdit = false;
	function setPermission() {
		var role = getUserRole(data?.user);

		if (role === 'creator') {
			canEdit = true;
		}
	}

	setPermission();
</script>

{#if product}
	<Card class="overflow-hidden rounded-lg bg-gray-900 shadow-lg">
		<div class="relative">
			<img src={product.cover_image} alt={product.name} class="h-48 w-full object-cover" />
		</div>
		<CardContent class="p-4">
			<CardTitle class="flex justify-between text-xl font-semibold ">
				{product.name}
				{#if canEdit}
					<Button variant="link">
						<a href={'/creator/marketplace/edit-product-' + product.id}><PencilIcon /></a>
					</Button>
				{/if}
			</CardTitle>
			<CardDescription class="mt-2 text-gray-400">
				<p class="mb-2">
					{product.description}
				</p>
				<div class="mt-2 flex justify-start text-gray-200">
					<CurrencyIcon class="mr-2" />
					{product.cost} Tokens
				</div>
			</CardDescription>
		</CardContent>
	</Card>
{/if}
