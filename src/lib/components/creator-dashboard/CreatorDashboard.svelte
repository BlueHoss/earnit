<script>
    import DashboardSummary from './DashboardSummary.svelte';
    import RedemptionsTable from './RedemptionsTable.svelte';
</script>

<div class="dashboard">
	<h2>Dashboard</h2>
	<DashboardSummary />

	<h3>Redemptions</h3>
	<RedemptionsTable />
</div>

<style>
    .dashboard {
      color: white;
      padding: 20px;
      flex-grow: 1;
    }
  
    h2 {
      font-size: 24px;
      margin-bottom: 20px;
    }
  
    h3 {
      font-size: 20px;
      margin-top: 40px;
      margin-bottom: 20px;
    }
</style>
