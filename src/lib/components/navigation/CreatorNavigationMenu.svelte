<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Missions from 'lucide-svelte/icons/orbit';
	import Profile from 'lucide-svelte/icons/user';
	import Home from 'lucide-svelte/icons/house';
	import Marketplace from 'lucide-svelte/icons/store';

	const navItems = [
		{ name: 'Dashboard', path: '/creator', icon: Home },
		{ name: 'Marketplace', path: '/creator/marketplace', icon: Marketplace },
		{ name: 'Missions', path: '/creator/missions', icon: Missions },
		{ name: 'Profile', path: '/creator/profile', icon: Profile }
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
