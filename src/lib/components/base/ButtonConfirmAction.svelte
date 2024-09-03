<script lang="ts">
	export let buttonText = 'Delete';
	export let icon = null;
	export let warningText = 'Are you sure?';
	export let callBack: CallbackFunction;

	import * as Popover from '$lib/components/ui/popover';
	import Button from '../ui/button/button.svelte';

	type CallbackFunction = () => void;

	let isOpen = false;

	function dismissAction() {
		isOpen = false;
	}

	function performAction() {
		if (callBack) {
			callBack();
		}
		isOpen = false;
	}
</script>

<Popover.Root bind:open={isOpen} closeOnOutsideClick={false}>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">
			{#if icon}
				<svelte:component this={icon} />
			{/if}
			{buttonText}
		</Button>
	</Popover.Trigger>
	<Popover.Content>
		<p>{warningText}</p>
		<Button variant="destructive" on:click={performAction}>Yes</Button>
		<Button variant="default" on:click={dismissAction}>No</Button>
	</Popover.Content>
</Popover.Root>
