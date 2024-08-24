<script lang="ts">
	export let data: PageData;

	import PageTitle from '../components/PageTitle.svelte';
	import type { PageData } from './$types';
	import SignUpForm from './SignUpForm.svelte';
</script>

<PageTitle
	title="Earn It - New Account!"
	description="Get started with Earn It by entering your details below."
/>

<SignUpForm data={data.form} />
