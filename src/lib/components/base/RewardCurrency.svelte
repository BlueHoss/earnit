<script lang="ts">
	export let amount = 0;
	export let name = '';
	import CurrencyIcon from 'lucide-svelte/icons/currency';

	const suffixes = ['', 'k', 'M', 'B', 'T'];
	$: formattedAmount = formatNumber(amount);

	function formatNumber(num: number): string {
		if (!num) {
			return '0';
		}

		if (amount < 1000) {
			return amount.toString();
		}

		const exp = Math.floor(Math.log(amount) / Math.log(1000));
		const formattedNumber = amount / Math.pow(1000, exp);
		const roundedNumber = Math.round(formattedNumber * 10) / 10;

		return `${roundedNumber}${suffixes[exp]}`;
	}
</script>

<div class="flex items-center gap-2">
	<CurrencyIcon size={16} />
	{formattedAmount}
	{name}
</div>
