<script>
	export let name = 'Unknown';
	export let value = 0;
	export let icon;

	import Pencil from 'lucide-svelte/icons/pencil';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	let isOpen = false;

	function saveFormValue() {
		console.log(value);
		isOpen = false;
	}
	function closeDrawer() {
		isOpen = false;
	}
</script>

<div class="flex items-center gap-4">
	<svelte:component this={icon} />
	<div class="grid gap-1">
		<p class="text-sm font-medium leading-none">{name}</p>
	</div>
	<div class="ml-auto flex items-center justify-end space-x-2 font-medium">
		<span>{value}</span>
		<Button on:click={() => (isOpen = true)}>
			<Pencil class="h-5 w-5" />
		</Button>
	</div>
</div>

<Drawer.Root bind:open={isOpen}>
	<!-- <Drawer.Trigger>Open</Drawer.Trigger> -->
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Edit {name} Rewards</Drawer.Title>
			<Drawer.Description>
				<p>Change how much your followers earn for {name}.</p>
				<form method="POST">
					<Label for="value">Merit Mission Value</Label>
					<Input id="value" bind:value />
				</form>
			</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<div class="flex justify-end space-x-4">
				<Button on:click={saveFormValue}>Submit</Button>
				<Button variant="secondary" on:click={closeDrawer}>Cancel</Button>
			</div>
			<!-- <Drawer.Close>Cancel</Drawer.Close> -->
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
