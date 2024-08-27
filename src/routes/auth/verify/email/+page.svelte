<script lang="ts">
	import SignOutButton from '$lib/components/base/SignOutButton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	export let data;
</script>

<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
	Confirm Your Email Address
</h1>
<p class="max-w-[900px] text-lg text-muted-foreground">
	Please check your email account for a message to confirm your email address for {PUBLIC_APP_NAME}.
	If you did not receive the email click the button below to resent it.
</p>

<div class="pt-5 flex items-center gap-2">
	<Button
		data-sveltekit-preload-data="off"
		href="/auth/verify/resend-email-{encodeURIComponent(data.user.email)}">Resend Email</Button
	>

	or

	<SignOutButton buttonText="Sign In" />
</div>
