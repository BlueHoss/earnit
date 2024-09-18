<script lang="ts">
	import MeritOfferingCard from '$lib/components/base/MeritOfferingCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import type { Product } from '$lib/schema/product.schema';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';

	export let products: Product[] | [] = [];
	export let user;
</script>

<Card.Root class="xl:col-span-2">
	<Card.Header class="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
		<div class="grid gap-2">
			<Card.Title>Merit Offerings ({products.length})</Card.Title>
			<Card.Description>
				All of your Merit Offerings that are displayed in your Marketplace
			</Card.Description>
		</div>
		<div class="flex justify-start sm:justify-end">
			<Button href="/creator/edit-product-0" class="w-full sm:w-auto">
				<CirclePlus /> Add New Merit Item
			</Button>
		</div>
	</Card.Header>
	<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		{#if !products || products.length === 0}
			<p>No Merit Offerings found</p>
		{:else}
			{#each products as product}
				<MeritOfferingCard {user} {product} />
			{/each}
		{/if}
	</Card.Content>
</Card.Root>
