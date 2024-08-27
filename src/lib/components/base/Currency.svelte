<script>
	export let amount = 0;
	export let currency = 'USD';

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency
	});

	$: formattedAmount = formatter.format(amount);
</script>

<span>{formattedAmount}</span>
