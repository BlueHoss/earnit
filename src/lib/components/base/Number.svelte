<script lang="ts">
	const suffixes = ['', 'k', 'M', 'B', 'T'];

	export let amount = 0;
	$: formattedAmount = formatNumber(amount);

	function formatNumber(num: number): string {
		if (amount < 1000) {
			return amount.toString();
		}

		const exp = Math.floor(Math.log(amount) / Math.log(1000));
		const formattedNumber = amount / Math.pow(1000, exp);
		const roundedNumber = Math.round(formattedNumber * 10) / 10;

		return `${roundedNumber}${suffixes[exp]}`;
	}
</script>

<span> {formattedAmount}</span>
