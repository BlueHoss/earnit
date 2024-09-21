<script lang="ts">
	import AdminLayout from '$lib/components/navigation/AdminLayout.svelte';
	import type { User } from 'lucia';

	interface PageData {
		user: User;
	}
	export let data: PageData;
</script>

<AdminLayout user={data.user}>
	<slot />
</AdminLayout>
