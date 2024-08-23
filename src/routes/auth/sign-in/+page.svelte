<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Loader2 } from 'lucide-svelte';
	import { AlertCircle } from 'lucide-svelte';
	import { z } from 'zod';
	import Label from '$lib/components/ui/label/label.svelte';
	import Error from '../../+error.svelte';
	import type { PageData } from './$types';
	import SigninForm from './signin-form.svelte';

	export let data: PageData;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<Card.Root>
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Sign in</Card.Title>
			<Card.Description
				>Don't have an account yet? <a href="/auth/sign-up" class="underline">Sign up here.</a
				></Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<!-- {#if $errors}
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Title></Alert.Title>
					<Alert.Description>
						{#each errors. as error}
							{error}
						{/each}
					</Alert.Description>
				</Alert.Root>
			{/if} -->
			<SigninForm data={data.form} />
			<div class="mt-6 text-center text-sm">
				<a href="/auth/password/reset" class="underline">Forgot your password?</a>
			</div>
		</Card.Content>
		<Card.Footer></Card.Footer>
	</Card.Root>
</div>
