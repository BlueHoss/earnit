<script lang="ts">
	import AuthLayout from '$lib/components/navigation/AuthLayout.svelte';
	import PublicLayout from '$lib/components/navigation/PublicLayout.svelte';
	import type { User } from 'lucia';
	import { userPrefersMode } from 'mode-watcher';

	interface PageData {
		user: User;
	}
	export let data: PageData;
</script>

{#if !data || !data.user}
	<PublicLayout>
		<slot />
	</PublicLayout>
{:else}
	<AuthLayout user={data.user}>
		<slot />
	</AuthLayout>
{/if}
