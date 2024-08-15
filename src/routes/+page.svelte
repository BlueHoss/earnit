<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<meta
		name="description"
		content="Earn It - A platform that redefines the way creators monetize engagement and enhance their social proof."
	/>
</svelte:head>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-2">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{APP_NAME}
			</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				Earn_It is redefining the way creators monetize engagement and enhance their social proof.
			</p>
			<p>
				Instead of traditional models that impose financial burdens on creators, Earn_It leverages a
				community-driven approach where the value creators add is directly rewarded by the
				engagement they foster.
			</p>

			<p>
				This allows them to capitalize on their influence without upfront costs, enabling
				sustainable growth and deeper connections with their audience.
			</p>
			<p>
				Our platform turns every interaction into a potential gain, ensuring that creators can focus
				on producing quality content and products.
			</p>
		</div>
		<div class="flex gap-4">
			<Button on:click={() => goto('/auth/sign-in')}>Sign in</Button>
			<Button on:click={() => goto('/auth/sign-up')} variant="outline">Sign up</Button>
		</div>
	</section>
</div>
