<script lang="ts">
	import type { PageData } from './$types';
	import '../app.pcss';
	import { page } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import Navigation from '$lib/components/navigation/navigation.svelte';
	import Sidebar from '$lib/components/navigation/Sidebar.svelte';
	import Header from '$lib/components/navigation/Header.svelte';
	import Dashboard from '$lib/components/creator-dashboard/CreatorDashboard.svelte';

	export let data: any;
	let user: PageData['user'];
	$: user = data.user;
	const flash = getFlash(page);
	//$: console.log('+layout.svelte root flash: ' + JSON.stringify($flash));
	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				//console.log('flash.message.success: ' + $flash.message);
				toast.success($flash.message);
				break;
			case 'error':
				//console.log('flash.message.error: ' + $flash.message);
				toast.error($flash.message);
				break;
		}
	}
</script>

<ModeWatcher />
<Toaster richColors />

<div class="app">
	<Sidebar />
	<div class="main-content">
		<Header />
		<Dashboard />
	</div>
</div>

<!-- <div class="relative flex min-h-screen flex-col">
	<Navigation {user} />
	<div class="mt-8 md:mt-12">
		<slot />
	</div>
</div> -->

<!-- <div class="relative flex min-h-screen flex-col">
	<Sidebar />
	<slot />
</div> -->

<!-- <style>
	.app {
	  display: flex;
	}
  </style> -->

<style>
	.app {
		display: flex;
		background-color: #121212;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	.main-content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
</style>
