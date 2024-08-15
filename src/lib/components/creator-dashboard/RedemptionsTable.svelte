<script>
	import TableRow from './TableRow.svelte';
</script>

<table class="redemptions-table">
	<thead>
		<tr>
			<th>Redeemer</th>
			<th>Product</th>
			<th>Redeemed</th>
		</tr>
	</thead>
	<tbody>
		<TableRow
			redeemerImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
			product="Facebook Ads Guru Course"
			redeemed="Jan 3, 2024"
		/>
		<TableRow
			redeemerImage="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
			product="Social Media Advertising Course"
			redeemed="Jan 3, 2024"
		/>
		<TableRow
			redeemerImage="https://unsplash.com/photos/womens-brown-sleeveless-shirt-A3Gd2b-98_g"
			product="Google Ads Course"
			redeemed="Jan 3, 2024"
		/>
	</tbody>
</table>

<style>
	.redemptions-table {
		width: 100%;
		background-color: #1c1c1e;
		border-radius: 10px;
		color: #ccc;
	}

	th,
	td {
		padding: 15px;
		text-align: left;
	}

	th {
		font-weight: bold;
		background-color: #1c1c1e;
	}
</style>
