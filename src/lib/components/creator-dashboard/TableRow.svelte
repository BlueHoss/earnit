<script>
    export let redeemerImage;
    export let product;
    export let redeemed;
</script>

<tr class="table-row">
	<td>
		<img class="redeemer-img" src={redeemerImage} alt="Redeemer Image" />
	</td>
	<td>{product}</td>
	<td>{redeemed}</td>
</tr>

<style>
    .table-row {
      background-color: #2c2c2e;
    }
  
    .redeemer-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
</style>
