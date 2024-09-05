<script lang="ts">
	import AuthLayout from '$lib/components/navigation/AuthLayout.svelte';
	import PublicLayout from '$lib/components/navigation/PublicLayout.svelte';
	import { getUserRole } from '$lib/utils/auth';
	export let data;
	let role = getUserRole(data.user);
</script>

{#if role == 'public'}
	<PublicLayout>
		<slot />
	</PublicLayout>
{:else}
	<AuthLayout data>
		<slot />
	</AuthLayout>
{/if}
