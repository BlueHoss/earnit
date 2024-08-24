<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import MissionsIcon from 'lucide-svelte/icons/orbit';
	import ProfileIcon from 'lucide-svelte/icons/user';
	import HomeIcon from 'lucide-svelte/icons/house';
	import MarketplaceIcon from 'lucide-svelte/icons/store';

	const navItems = [
		{ name: 'Dashboard', path: '/creator', icon: HomeIcon },
		{ name: 'Marketplace', path: '/creator/marketplace', icon: MarketplaceIcon },
		{ name: 'Missions', path: '/creator/missions', icon: MissionsIcon },
		{ name: 'Profile', path: '/creator/profile', icon: ProfileIcon }
	];

	// Get the current path
	const currentPath = derived(page, ($page) => $page.url.pathname);
</script>

<nav class="space-y-1">
	{#each navItems as item}
		<a
			href={item.path}
			class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all
	{$currentPath === item.path ? 'bg-blue-500 text-white' : 'hover:text-primary'}"
		>
			<svelte:component this={item.icon} class="h-4 w-4" />
			{item.name}
		</a>
	{/each}
</nav>
