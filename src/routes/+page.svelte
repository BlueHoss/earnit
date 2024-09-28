<!-- src/routes/+page.svelte -->
<script lang="ts">
	import * as Input from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import CreatorCard from './components/CreatorCard.svelte';

	export let data: PageData;

	let searchTerm = '';
	let selectedCategory = '';

	$: filteredCreators = data.creators.filter((creator) => {
		const nameMatch = creator.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
		const categoryMatch = selectedCategory === '' || creator.category === selectedCategory;
		return nameMatch && categoryMatch;
	});

	$: categories = [...new Set(data.creators.map((creator) => creator.category).filter(Boolean))];

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
	}

	function handleCategorySelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedCategory = target.value;
	}

	function handleNavigationToApp() {
		if (data.user) {
			if (data.user.is_creator) {
				window.location.href = '/creator';
				return;
			} else {
				window.location.href = '/earn';
				return;
			}
		}
	}
</script>

<div class="container mx-auto py-8">
	<!-- Hero Section -->
	<!-- <div class="bg-primary text-primary-foreground rounded-lg p-8 mb-12">
		<h1 class="text-4xl font-bold mb-4">Welcome to Earn It!</h1>
		<p class="text-xl mb-6">Discover amazing creators and their unique offerings!</p>
		<div class="flex gap-4">
			{#if !data.user}
				<Button variant="default">
					<a href="/auth/sign-in">Sign In</a>
				</Button>
				<Button variant="secondary">
					<a href="/auth/sign-up">Sign Up</a>
				</Button>
			{:else}
				<Button on:click={handleNavigationToApp} variant="secondary">Go to App</Button>
			{/if}
		</div>
	</div> -->

	<div class="hero-section rounded-lg p-8 mb-12 text-white">
		<div class="hero-content">
			<br /><br /><br /><br />
			<!-- <h1 class="text-4xl font-bold mb-4">Welcome to Earn It!</h1>
			<p class="text-xl mb-6">Discover amazing creators and their unique offerings!</p> -->
			<div class="flex gap-4">
				{#if !data.user}
					<Button variant="default">
						<a href="/auth/sign-in">Sign In</a>
					</Button>
					<Button variant="secondary">
						<a href="/auth/sign-up">Sign Up</a>
					</Button>
				{:else}
					<Button on:click={handleNavigationToApp} variant="secondary">Go to App</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Creator Catalog Section -->
	<h2 class="text-3xl font-bold mb-8">Explore Creators</h2>

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
			<select
				bind:value={selectedCategory}
				on:change={handleCategorySelect}
				class="w-full p-2 border rounded"
			>
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

<style>
	.hero-section {
		background-image: url('/img/banner.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}
</style>
