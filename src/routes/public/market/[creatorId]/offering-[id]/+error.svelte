<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>

{#if $page.error?.code === 'ITEM_NOT_FOUND'}
	<p>We couldn't find the item you're looking for. It may have been removed or doesn't exist.</p>
{/if}

<a href="/">Go back to home</a>
