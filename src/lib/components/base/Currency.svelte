<!-- <script>
	export let amount = 0;
	export let currency = 'USD';

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency
	});

	$: formattedAmount = formatter.format(amount);
</script>

<span>{formattedAmount}</span> -->

<script lang="ts">
	export let amount = 0;
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	$: formattedAmount = formatNumber(amount);

	function formatNumber(num: number): string {
		return num.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}
</script>

<div class="flex items-center gap-2 justify-end">
	<CurrencyIcon size={16} />
	{formattedAmount}
</div>
