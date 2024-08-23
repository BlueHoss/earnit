<script>
	import Label from '$lib/components/ui/label/label.svelte';

	let imagePreview = '';

	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="mx-auto max-w-md rounded-lg bg-gray-800 p-6 shadow-md">
	<Label class="font-mediume mb-2 block text-sm">Upload a cover image</Label>

	<div class="flex w-full items-center justify-center">
		<label
			for="file-upload"
			class="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600"
		>
			{#if imagePreview}
				<img
					src={imagePreview}
					alt="Headliner Preview"
					class="h-full w-full rounded-lg object-cover"
				/>
			{:else}
				<div class="flex flex-col items-center justify-center pb-6 pt-5">
					<svg
						aria-hidden="true"
						class="mb-3 h-10 w-10 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 1 1 8 0M5 12h14M12 14v2m0-6h.01"
						></path>
					</svg>
					<p class="mb-2 text-sm text-gray-500">Click to upload</p>
					<p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
				</div>
			{/if}
			<input id="file-upload" type="file" class="hidden" on:change={handleImageUpload} />
		</label>
	</div>
</div>
