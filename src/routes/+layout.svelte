<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import CircleCheckIcon from 'lucide-svelte/icons/circle-check-big';
	import CircleXIcon from 'lucide-svelte/icons/circle-x';

	const flash = getFlash(page);

	$: if ($flash) {
		toast($flash.message, {
			icon: $flash.type == 'success' ? CircleCheckIcon : CircleXIcon
		});
	}

	// Clear the flash message to avoid double-toasting.
	$flash = undefined;
</script>

<ModeWatcher />

<Toaster />
<!-- {#if $flash}
	{@const bg = $flash.type == 'success' ? '#3D9970' : '#FF4136'}
	<div style:background-color={bg} class="flash">{$flash.message}</div>
{/if} -->

<main class="w-full lg:grid">
	<div class="flex items-center justify-center">
		<slot></slot>
	</div>
</main>
