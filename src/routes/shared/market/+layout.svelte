<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../../../app.pcss';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Package2 } from 'lucide-svelte';
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
			<Button>Login</Button>
		</header>

		<main class="flex flex-1 flex-col justify-center gap-4 p-4 lg:gap-6 lg:p-6">
			<slot></slot>
		</main>
	</div>
</div>
