<script lang="ts">
	import ModeSwitch from '$lib/components/base/ModeSwitch.svelte';
	import '../../../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Package2 from 'lucide-svelte/icons/package-2';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<ModeWatcher />
<div class="grid min-h-screen w-full">
	<div class="flex flex-col">
		<header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<!-- Logo and Product Name -->
			<a href="/" class="flex items-center gap-2 font-semibold">
				<Package2 class="h-6 w-6" />
				<span class="">Earn It</span>
			</a>

			<!-- Spacer to push the user menu to the right -->
			<div class="w-full flex-1"></div>

			<!-- Login or switch to my profile -->
			<Button href="/auth/sign-in">Login</Button>
			<ModeSwitch />
		</header>
		<main class="flex flex-1 flex-col justify-center gap-4 p-4 lg:gap-6 lg:p-6">
			<slot />
		</main>
	</div>
</div>
