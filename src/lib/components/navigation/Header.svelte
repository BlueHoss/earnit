<script>
	export let profileImage =
		'https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D';
</script>

<div class="header">
	<div class="profile-area">
		<i class="bell-icon">🔔</i>
		<img class="profile-img" src={profileImage} alt="Profile Image" />
	</div>
</div>

<style>
	.header {
		background-color: #000;
		padding: 15px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-radius: 0 25px 0 0;
	}

	.profile-area {
		display: flex;
		align-items: center;
	}

	.bell-icon {
		font-size: 24px;
		margin-right: 15px;
		cursor: pointer;
	}

	.profile-img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
