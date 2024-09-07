<script lang="ts">
	import PageHeader from '$lib/components/base/PageHeaderCreator.svelte';
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
	<PageHeader user={data.creator} />

	<Card class="mb-4 overflow-hidden">
		<CardContent class="p-0">
			<div class="flex flex-col md:flex-row">
				<div class="md:w-1/3 bg-gray-100 dark:bg-gray-800">
					<img
						src={data.product.cover_image}
						alt={data.product.name}
						class="w-full h-full object-cover"
					/>
				</div>
				<div class="flex flex-col justify-between p-6 md:w-2/3">
					<div class="space-y-4">
						<CardTitle class="text-3xl font-bold text-primary">{data.product.name}</CardTitle>
						<CardDescription class="text-sm text-gray-600 dark:text-gray-300">
							{data.product.description}
						</CardDescription>
						<div class="flex items-center space-x-2">
							<Badge variant="secondary" class="text-sm py-1">
								{data.product.item_count} Digital Downloads
							</Badge>
							<span class="text-sm text-gray-500">included with this product</span>
						</div>
					</div>
					<div class="mt-6 flex items-center justify-between">
						<Badge variant="outline" class="text-xl py-2 px-4">
							Effort Credits: {data.product.cost}
						</Badge>
						<Button variant="default" class="px-6 py-2">Redeem</Button>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</PageWrapper>
