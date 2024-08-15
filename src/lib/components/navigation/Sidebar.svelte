<script>
	import NavItem from './NavItem.svelte';
</script>

<div class="sidebar">
	<div class="logo">
		<!-- <img src="/path-to-logo.png" alt="Earn_It Logo" /> -->
		<h1>Earn It</h1>
	</div>

	<nav>
		<NavItem icon="home" label="Dashboard" active={true} />
		<NavItem icon="marketplace" label="Marketplace" />
		<NavItem icon="missions" label="Missions" />
		<NavItem icon="profile" label="Profile" />
		<NavItem icon="settings" label="Settings" />
		<NavItem icon="help" label="Help & feedback" />
	</nav>
</div>

<style>
	.sidebar {
		background-color: #000;
		color: white;
		width: 250px;
		padding: 20px;
		border-radius: 25px 0 0 25px;
		height: 100vh;
	}

	.logo {
		display: flex;
		align-items: center;
		margin-bottom: 40px;
	}

	.logo img {
		width: 40px;
		height: 40px;
		margin-right: 10px;
	}

	.logo h1 {
		font-size: 24px;
		font-weight: bold;
	}

	nav {
		display: flex;
		flex-direction: column;
	}
</style>
