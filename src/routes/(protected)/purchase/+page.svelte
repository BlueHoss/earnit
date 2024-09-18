<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import type { ProductQueryResult } from '$lib/schema/product.schema';
	import MeritOfferingCardPurchased from '$lib/components/base/MeritOfferingCardPurchased.svelte';
	import PageHeaderFollower from '$lib/components/base/FollowerPageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';

	interface PageData {
		products: ProductQueryResult[];
	}

	export let data: PageData;
</script>

<PageWrapper>
	<PageHeaderFollower {data} Title="Purchase's" />
	<Card.Root class="xl:col-span-2">
		<Card.Header class="flex flex-row items-center">
			<div class="grid gap-2">
				<Card.Title>Your products</Card.Title>
				<Card.Description>Your Merit Offerings redeemed with credits!</Card.Description>
			</div>
		</Card.Header>
		<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
			{#each data.products as product}
				<a href="/follower/purchase/{product.id}">
					<MeritOfferingCardPurchased {product} />
				</a>
			{/each}
		</Card.Content>
	</Card.Root>
</PageWrapper>
