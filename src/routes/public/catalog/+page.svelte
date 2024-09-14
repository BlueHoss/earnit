<!-- src/routes/creator-catalog/+page.svelte -->
<script lang="ts">
	import * as Input from '$lib/components/ui/input';
	import type { PageData } from './$types';
	import CreatorCard from './components/CreatorCard.svelte';

	export let data: PageData;

	let searchTerm = '';
	let selectedCategory = '';

	$: {
		console.log('Search Term Changed:', searchTerm);
		console.log('Selected Category Changed:', selectedCategory);
	}

	$: filteredCreators = data.creators.filter((creator) => {
		const nameMatch = creator.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
		const categoryMatch = selectedCategory === '' || creator.category === selectedCategory;
		console.log(
			`Creator: ${creator.store_name}, Name Match: ${nameMatch}, Category Match: ${categoryMatch}`
		);
		return nameMatch && categoryMatch;
	});

	$: categories = [...new Set(data.creators.map((creator) => creator.category).filter(Boolean))];

	$: console.log('Filtered Creators:', filteredCreators);
	$: console.log('Categories:', categories);

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		console.log('Search Input Event:', searchTerm);
	}

	function handleCategorySelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedCategory = target.value;
		console.log('Category Select Event:', selectedCategory);
	}
</script>

<div class="container mx-auto py-2">
	<h1 class="text-3xl font-bold mb-8">Creator Catalog</h1>

	<div class="flex flex-col md:flex-row gap-4 mb-8">
		<div class="flex-grow">
			<Input.Input
				type="text"
				placeholder="Search creators..."
				value={searchTerm}
				on:input={handleSearchInput}
			/>
		</div>
		<div class="w-full md:w-48">
			<select bind:value={selectedCategory} on:change={handleCategorySelect}>
				<option value="">All Categories</option>
				{#each categories as category}
					<option value={category}>{category || 'Uncategorized'}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each filteredCreators as creator (creator.id)}
			<CreatorCard {creator} />
		{/each}
	</div>

	{#if filteredCreators.length === 0}
		<p class="text-center mt-8">No creators found matching your search criteria.</p>
	{/if}
</div>
