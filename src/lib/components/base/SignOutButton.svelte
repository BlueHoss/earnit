<script lang="ts">
	export let buttonText = 'Sign Out';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<form method="POST" action="/auth/sign-out">
	<Button variant="link" type="submit">{buttonText}</Button>
</form>
