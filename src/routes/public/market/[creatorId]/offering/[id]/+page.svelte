<script lang="ts">
	import PageHeader from '$lib/components/base/PageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { ProductWithItemCount } from '$lib/schema/product.schema';
	import type { User } from 'lucia';
	import { Card, CardContent, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	interface PageData {
		creator: User;
		product: ProductWithItemCount;
	}

	export let data: PageData;
</script>

<PageWrapper>
	<PageHeader user={data.creator} Title="Products" />
	<Card class="mb-2">
		<CardContent class="p-3">
			<div class="flex justify-between">
				<div class="flex flex-col justify-between max-w-xl w-full pr-4">
					<div class="space-y-4">
						<CardTitle class="text-2xl font-bold">{data.product.name}</CardTitle>
						<CardDescription>{data.product.description}</CardDescription>
						<Button variant="default">Redeem</Button>
					</div>
					<div class="space-y-2 mt-auto">
						<Badge variant="secondary" class="h-16 text-lg">
							Effort Credits: {data.product.cost}
						</Badge>
						<div>
							<Badge>{data.product.item_count}</Badge> Digital Downloads included with this product.
						</div>
					</div>
				</div>
				<div class="w-64 h-64 rounded-lg overflow-hidden flex-shrink-0">
					<img
						src={data.product.cover_image}
						alt={data.product.name}
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</CardContent>
	</Card>
</PageWrapper>

<style>
	/* Add any additional custom styles here
	:global(.bg-gray-800) {
		background-color: #1f2937;
	}
	:global(.bg-gray-700) {
		background-color: #374151;
	} */
</style>
