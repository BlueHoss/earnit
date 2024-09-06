<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../../app.pcss';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CircleUser, Menu, Package2 } from 'lucide-svelte';
	import { Bell } from 'svelte-radix';
	import NavigationMenu from '$lib/components/navigation/CreatorNavigationMenu.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ModeSwitch from '$lib/components/base/ModeSwitch.svelte';
</script>

<ModeWatcher />
<div class="grid min-h-screen w-full">
	<!-- Removed the left sidebar div -->
	<div class="flex flex-col">
		<header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
						<Menu class="h-5 w-5" />
						<span class="sr-only">Toggle navigation menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex flex-col">
					<nav class="grid gap-2 text-lg font-medium">
						<!-- <NavigationMenu /> -->
						menu
					</nav>
					<!-- <div class="mt-auto">
						<Card.Root>
							<Card.Header>
								<Card.Title>Earn It Pro</Card.Title>
								<Card.Description>Want to unlock more credits?</Card.Description>
							</Card.Header>
							<Card.Content>
								<Button size="sm" class="w-full">Upgrade</Button>
							</Card.Content>
						</Card.Root>
					</div> -->
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
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Support</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item><a href="/auth/sign-in">Logout</a></DropdownMenu.Item>
				</DropdownMenu.Content>
				<ModeSwitch />
			</DropdownMenu.Root>
		</header>
		<main class="flex flex-1 flex-col justify-center gap-4 p-4 lg:gap-6 lg:p-6">
			<slot></slot>
		</main>
	</div>
</div>
