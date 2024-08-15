<script>
	export let icon;
	export let label;
	export let active = false;
</script>

<div class={`nav-item ${active ? 'active' : ''}`}>
	<i class={`icon-${icon}`}></i>
	<span>{label}</span>
</div>

<style>
	.nav-item {
		display: flex;
		align-items: center;
		padding: 15px 10px;
		border-radius: 10px;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.nav-item span {
		margin-left: 10px;
		font-size: 16px;
	}

	.nav-item.active {
		background-color: #007bff;
	}

	.nav-item.active span {
		color: white;
	}

	.icon-home::before {
		content: '🏠';
	}
	.icon-marketplace::before {
		content: '🛒';
	}
	.icon-missions::before {
		content: '📋';
	}
	.icon-profile::before {
		content: '👤';
	}
	.icon-settings::before {
		content: '⚙️';
	}
	.icon-help::before {
		content: '❓';
	}
</style>
