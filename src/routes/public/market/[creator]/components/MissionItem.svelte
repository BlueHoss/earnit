<script>
	export let name = 'Unknown';
	export let value = 0;
	export let icon;

	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
</script>

<div class="flex items-center gap-4">
	<svelte:component this={icon} />
	<div class="grid gap-1">
		<p class="text-sm font-medium leading-none">{name}</p>
	</div>
	<div class="ml-auto flex items-center justify-end space-x-2 font-medium">
		<span>{value}</span>
	</div>
</div>
