<script>
    export let label;
    export let value;
    export let icon;
</script>

<div class="summary-card">
	<div class="icon">{icon}</div>
	<div class="info">
		<p class="label">{label}</p>
		<h4 class="value">{value}</h4>
	</div>
</div>

<style>
    .summary-card {
      background-color: #1c1c1e;
      border-radius: 10px;
      padding: 20px;
      flex: 1;
      display: flex;
      align-items: center;
      color: #ccc;
    }
  
    .icon {
      font-size: 36px;
      margin-right: 20px;
    }
  
    .info {
      text-align: left;
    }
  
    .label {
      font-size: 14px;
      margin-bottom: 5px;
    }
  
    .value {
      font-size: 24px;
      color: #007bff;
    }
</style>
