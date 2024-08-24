<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<form method="POST" action="/auth/sign-out">
	<Button variant="link" type="submit">Sign Out</Button>
</form>
