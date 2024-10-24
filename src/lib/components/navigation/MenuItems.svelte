<script lang="ts">
	export let MenuItems: { name: string; path: string; icon: any }[] = [];

	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	const currentPath = derived(page, ($page) => $page.url.pathname);
</script>

<nav class="space-y-1">
	{#each MenuItems as item}
		<a
			data-sveltekit-preload-data="tap"
			data-comment="preload-data=tap will prevent the UI from loading the page until the user actually clicks the link."
			href={item.path}
			class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all
	{$currentPath === item.path ? 'bg-blue-500 text-white' : 'hover:text-primary'}"
		>
			<svelte:component this={item.icon} class="h-4 w-4" />
			{item.name}
		</a>
	{/each}
</nav>
