<script lang="ts">
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ProductItemNewUpdateType } from '$lib/schema/product.schema';
	import ButtonConfirmAction from '$lib/components/base/ButtonConfirmAction.svelte';

	export let uploads: ProductItemNewUpdateType[] = [];

	function handleAddUpload() {
		uploads = [...uploads, { name: '', download_url: '', file: null }];
	}

	function handleFileChange(event: Event, index: number) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) uploads[index].file = file;
	}

	function handleNameChange(event: Event, index: number) {
		const target = event.target as HTMLInputElement;
		uploads[index].name = target.value;
	}

	function removeUpload(index: number, productItemId: number | undefined) {
		if (productItemId) {
			var deleteForm = document.getElementById(`deleteItemForm-${productItemId}`);
			if (deleteForm) {
				deleteForm.submit();
			}
		}
		uploads = uploads.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-4">
	{#each uploads as upload, index}
		<div class="flex items-center space-x-4">
			<input
				type="text"
				placeholder="Enter file name"
				class="w-1/2 rounded p-2 max-w-40"
				value={upload.name}
				on:input={(e) => handleNameChange(e, index)}
			/>
			{#if upload.download_url}
				<a href={upload.download_url} target="_blank" class=" w-1/2 text-blue-500"
					>{upload.file_name}</a
				>
			{:else}
				<input type="file" class="w-1/2 rounde" on:change={(e) => handleFileChange(e, index)} />
			{/if}

			<form id="deleteItemForm-{upload.id}" method="POST" action="?/deleteProductItem">
				<input type="hidden" name="productItemId" value={upload.id} />
				<ButtonConfirmAction
					buttonText="Delete Download"
					warningText="Are you sure you want to delete this download?"
					callBack={() => removeUpload(index, upload.id)}
				></ButtonConfirmAction>
			</form>
			<!-- <button class="text-red-500" on:click={() => removeUpload(index)}> Remove </button> -->
		</div>
	{/each}

	<Button on:click={handleAddUpload}><CirclePlus /> Add another item</Button>
</div>
