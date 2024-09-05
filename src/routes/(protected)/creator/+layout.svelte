<script lang="ts">
	import AuthLayout from '$lib/components/navigation/AuthLayout.svelte';
	import PublicLayout from '$lib/components/navigation/PublicLayout.svelte';
	import type { UserPageData } from './types';

	export let data: UserPageData;
</script>

{#if data.user.user_type == 'public'}
	<PublicLayout>
		<slot />
	</PublicLayout>
{:else}
	<AuthLayout user={data.user}>
		<slot />
	</AuthLayout>
{/if}
