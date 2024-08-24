<script lang="ts">
	export let data: PageData;

	import type { PageData } from './$types';
	import SignInForm from './SignInForm.svelte';
	import PageTitle from '../components/PageTitle.svelte';
</script>

<PageTitle title="Earn It - Login" description="Enter your email below to login to your account" />
<SignInForm data={data.form} />
