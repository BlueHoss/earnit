<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import Button from '../ui/button/button.svelte';
	import type { Product } from '$lib/schema/product.schema';
	import type { User } from 'lucia';
	import RewardCurrency from './RewardCurrency.svelte';

	export let product: Product;
	export let user: User;

	var canEdit = false;

	$: if (user && user.user_type === 'creator') {
		canEdit = true;
	}
</script>

{#if product}
	<Card class="overflow-hidden rounded-lg bg-border shadow-lg">
		<div class="relative">
			<img src={product.cover_image} alt={product.name} class="h-48 w-full object-cover" />
		</div>
		<CardContent class="p-4">
			<CardTitle class="flex justify-between text-xl font-semibold ">
				{product.name}
				{#if canEdit}
					<Button variant="link">
						<a href={'/creator/edit-product-' + product.id}><PencilIcon /></a>
					</Button>
				{/if}
			</CardTitle>
			<CardDescription class="mt-2 ">
				<p class="mb-2">
					{product.description}
				</p>
				<div class="mt-2 flex justify-start">
					<RewardCurrency amount={product.cost} />
				</div>
			</CardDescription>
		</CardContent>
	</Card>
{/if}
