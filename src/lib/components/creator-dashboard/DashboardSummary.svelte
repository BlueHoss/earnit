<script>
    import SummaryCard from './SummaryCard.svelte';
</script>

<div class="dashboard-summary">
	<SummaryCard label="Available Effort Credits" value="9,000" icon="💳" />
	<SummaryCard label="Distributed this month" value="3,000" icon="📅" />
	<SummaryCard label="Redeemed this month" value="3,000" icon="🎁" />
</div>

<style>
    .dashboard-summary {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
    }
</style>
