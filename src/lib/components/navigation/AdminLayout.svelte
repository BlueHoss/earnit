<script lang="ts">
	import ModeSwitch from '$lib/components/base/ModeSwitch.svelte';
	import '../../../app.pcss';
	import { ModeWatcher, userPrefersMode } from 'mode-watcher';
	import CircleUser from 'lucide-svelte/icons/circle-user';

	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import SignoutButton from '$lib/components/base/SignOutButton.svelte';
	import type { User } from 'lucia';

	import MarketplaceIcon from 'lucide-svelte/icons/store';
	import CreatorCatalogIcon from 'lucide-svelte/icons/album';
	import MenuItems from '$lib/components/navigation/MenuItems.svelte';

	export let user: User;
	let menu: any;
	let myAccountMenu: { name: string; link: string }[] = [];
	let mainMenu: { name: string; path: string; icon: any }[] = [];

	function buildMainMenu() {
		mainMenu.push({ name: 'App', path: '/', icon: CreatorCatalogIcon });
		mainMenu.push({ name: 'Admin', path: '/admin', icon: MarketplaceIcon });
	}
	buildMainMenu();

	let isMobileOpen = false;

	function handleMenuItemClick() {
		isMobileOpen = false;
	}
</script>

<ModeWatcher />
<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<div class="hidden border-r bg-muted/40 md:block">
		<div class="flex h-full max-h-screen flex-col gap-2">
			<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<a href="/" class="flex items-center gap-2 font-semibold">
					<Package2 class="h-6 w-6" />
					<span class="">Earn It</span>
				</a>
			</div>
			<div class="flex-1">
				<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
					<MenuItems MenuItems={mainMenu} />
				</nav>
			</div>
		</div>
	</div>
	<div class="flex flex-col">
		<header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<Sheet.Root bind:open={isMobileOpen}>
				<Sheet.Trigger asChild let:builder>
					<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex flex-col">
					<nav class="grid gap-2 text-lg font-medium">
						<MenuItems MenuItems={mainMenu} on:itemClick={handleMenuItemClick} />
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<div class="w-full flex-1"></div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
						<CircleUser class="h-5 w-5" />
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each myAccountMenu as { name, link }}
						<DropdownMenu.Item><a href={link}>{name}</a></DropdownMenu.Item>
					{/each}
					<DropdownMenu.Item
						><a href="https://earnitrewards.com" target="_blank">Support</a></DropdownMenu.Item
					>
					<DropdownMenu.Separator />
					<DropdownMenu.Item><SignoutButton /></DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<ModeSwitch />
		</header>
		<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<slot></slot>
		</main>
	</div>
</div>
