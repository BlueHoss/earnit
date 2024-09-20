<script lang="ts">
	import PageHeaderFollower from '$lib/components/base/FollowerPageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { ProductQueryResult } from '$lib/schema/product.schema';
	import type { User } from 'lucia';
	import ErrorIcon from 'lucide-svelte/icons/circle-x';
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
	import DateFormatter from '$lib/components/base/DateFormatter.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	interface PageData {
		user: User;
		product: ProductQueryResult;
	}

	export let data: PageData;
</script>

<PageWrapper>
	{#if data.product}
		<PageHeaderFollower {data} Title="Purchase of '{data.product.name}'" />

		<Card class="mb-2">
			<CardContent class="p-3 flex justify-between">
				<div class="flex flex-col justify-between max-w-xl w-full pr-4">
					<div class="space-y-4">
						<CardTitle class="text-3xl font-bold text-primary">{data.product.name}</CardTitle>
						<CardDescription>{data.product.description}</CardDescription>
					</div>
					<div class="space-y-2 mt-auto">
						<Badge>
							Effort Credits Used: {data.product.cost}
						</Badge>
						<Badge variant="secondary">
							Purchased: <DateFormatter date={data.product.date_purchased} format="fromNow" />
							- <i><DateFormatter date={data.product.date_purchased} format="short" /></i>
						</Badge>
					</div>
				</div>
				<div class="w-64 h-64 rounded-lg overflow-hidden flex-shrink-0">
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
				<CardTitle>Digital Offering Files</CardTitle>
				<CardDescription>Offering files can be downloaded below!</CardDescription>
			</CardHeader>
			<CardContent>
				{#if data.product.productItems && data.product.productItems.length > 0}
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
				{/if}
			</CardContent>
		</Card>
	{:else}
		<Card class="mb-8">
			<CardContent class="p-6">
				<CardTitle class="text-2xl font-bold">
					<div class="flex items-center space-x-4">
						<ErrorIcon class="w-24 h-24" />The product was not found!
					</div>
				</CardTitle>
				<CardDescription>Please search for your purchased products again.</CardDescription>
			</CardContent>
		</Card>
	{/if}
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
