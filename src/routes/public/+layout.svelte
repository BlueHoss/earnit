<script lang="ts">
	import AuthLayout from '$lib/components/navigation/AuthLayout.svelte';
	import PublicLayout from '$lib/components/navigation/PublicLayout.svelte';
	import { getUserRole } from '$lib/utils/auth';
	let role = getUserRole();
</script>

{#if role == 'public'}
	<PublicLayout>
		<slot />
	</PublicLayout>
{:else}
	<AuthLayout>
		<slot />
	</AuthLayout>
{/if}
