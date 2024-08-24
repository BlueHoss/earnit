<script lang="ts">
	export let amount = 0;
	$: formattedAmount = formatNumber(amount);

	function formatNumber(num: number): string {
		return num.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});
	}
</script>

<span> {formattedAmount}</span>
