<script>
	import { onMount } from 'svelte';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import Button from '$lib/components/ui/button/button.svelte';

	let uploads = [{ id: 1, name: '', file: null }];

	function handleAddUpload() {
		uploads = [...uploads, { id: uploads.length + 1, name: '', file: null }];
	}

	function handleFileChange(event, index) {
		const file = event.target.files[0];
		uploads[index].file = file;
	}

	function handleNameChange(event, index) {
		uploads[index].name = event.target.value;
	}

	function removeUpload(index) {
		uploads = uploads.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-4">
	{#each uploads as upload, index}
		<div class="flex items-center space-x-4">
			<input
				type="text"
				placeholder="Enter file name"
				class="w-1/2 rounded bg-gray-800 p-2"
				value={upload.name}
				on:input={(e) => handleNameChange(e, index)}
			/>
			<input
				type="file"
				class="w-1/2 rounded bg-gray-800"
				on:change={(e) => handleFileChange(e, index)}
			/>
			<button class="text-red-500" on:click={() => removeUpload(index)}> Remove </button>
		</div>
	{/each}

	<Button on:click={handleAddUpload}><CirclePlus /> Add another item</Button>
</div>
