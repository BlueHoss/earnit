<script>
	import Button from '$lib/components/ui/button/button.svelte';

	let distResult = '';
	let running = false;

	async function runDistributions() {
		running = true;
		try {
			const res = await fetch('/api/cron/distribute-rewards', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			distResult = JSON.stringify(data);
			console.log(data);
		} catch (error) {
			console.log(error);
			distResult = JSON.stringify(error);
		} finally {
			running = false;
		}
	}
</script>

<h1>Welcome to Admin</h1>

<h1>Run Distributions to followers. This can only be ran once per day</h1>

{#if running}
	Running...
{:else}
	<Button on:click={runDistributions}>Run Distributions</Button>
{/if}

{#if distResult}
	Result: {distResult}
{/if}
