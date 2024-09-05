<script lang="ts">
	import PageHeader from '$lib/components/base/PageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { FullProduct } from '$lib/schema/product.schema';
	import type { User } from 'lucia';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	interface PageData {
		creator: User;
		product: FullProduct;
	}

	export let data: PageData;
</script>

<PageWrapper>
	<PageHeader user={data.creator} Title="Products" />

	<!-- <div class="max-w-4xl mx-auto p-4"> -->
	<Card class="mb-8">
		<CardContent class="p-6 flex justify-between items-center">
			<div class="space-y-4 max-w-xl">
				<div class="inline-block bg-muted text-sm px-3 py-1 rounded-full">
					Effort Credits: {data.product.cost}
				</div>
				<CardTitle class="text-2xl font-bold">{data.product.name}</CardTitle>
				<CardDescription>{data.product.description}</CardDescription>
				<Button variant="default">Redeem</Button>
			</div>
			<div class="w-64 h-64 rounded-lg overflow-hidden">
				<img
					src={data.product.cover_image}
					alt={data.product.name}
					class="w-full h-full object-cover"
				/>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Offering</CardTitle>
			<CardDescription>Offering files can be downloaded after purchase.</CardDescription>
		</CardHeader>
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Offering</TableHead>
						<TableHead class="text-right">Download</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.product.productItems as offering}
						<TableRow>
							<TableCell>{offering.name}</TableCell>
							<TableCell class="text-right">
								<Button href={offering.download_url} variant="default">Download</Button>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
	<!-- </div> -->
</PageWrapper>

<style>
	/* Add any additional custom styles here */
	:global(.bg-gray-800) {
		background-color: #1f2937;
	}
	:global(.bg-gray-700) {
		background-color: #374151;
	}
</style>
