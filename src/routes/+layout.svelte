<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
	import { getFlash, initFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

	initFlash(page, {
		clearAfterMs: 8000 // Clear the flash message after 5 seconds
	});

	const flash = getFlash(page);

	$: if ($flash) {
		if ($flash.type === 'error') {
			toast.error($flash.message);
		} else {
			toast.success($flash.message);
		}
	}
</script>

<ModeWatcher />
<main class="w-full lg:grid">
	<Toaster closeButton />
	<div class="flex items-center justify-center">
		<slot></slot>
	</div>
</main>
