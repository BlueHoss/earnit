<script lang="ts">
	console.log('Minimal component script starting');

	function handleFileChange(event: Event) {
		console.log('File selected in minimal component');
	}
</script>

<input type="file" on:change={handleFileChange} />
