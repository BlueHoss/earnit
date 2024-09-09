<script lang="ts">
	export let amount = 0;
	export let name = '';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	$: formattedAmount = formatNumber(amount);

	function formatNumber(num: number): string {
		return num.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}
</script>

<div class="flex items-center gap-2">
	<CurrencyIcon size={16} />
	{formattedAmount}
	{name}
</div>
