<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import type { ProductQueryResult } from '$lib/schema/product.schema';
	export let product: ProductQueryResult;
</script>

{#if product}
	<Card class="overflow-hidden rounded-lg bg-border shadow-lg">
		<div class="relative">
			<img src={product.cover_image} alt={product.name} class="h-48 w-full object-cover" />
		</div>
		<CardContent class="p-4">
			<div>
				<a href="/market/{product.creator_user_id}">
					{product.store_name}
				</a>
			</div>
			<CardTitle class="flex justify-between text-xl font-semibold ">
				<div class="">
					{product.name}
				</div>
			</CardTitle>
			<CardDescription class="mt-2 ">
				<p class="mb-2">
					{product.description}
				</p>
				<div class="mt-2 flex justify-start">
					<CurrencyIcon class="mr-2" />
					{product.cost}
					{product.reward_name} Credits
				</div>
				<div>{product.item_count} file downloads</div>
			</CardDescription>
		</CardContent>
	</Card>
{/if}
