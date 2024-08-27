<script lang="ts">
	export let data: SuperValidated<PasswordUpdateRequest>;

	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '$lib/components/ui/input/input.svelte';
	import { passworUpdateRequestSchema, type PasswordUpdateRequest } from '$lib/schema/login.schema';
	import Button from '$lib/components/ui/button/button.svelte';
	import PageTitle from '../../components/PageTitle.svelte';

	const form = superForm(data, {
		validators: zodClient(passworUpdateRequestSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});

	const { form: formData, errors, enhance, delayed } = form;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<form method="POST" use:enhance>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Reset Your Password</Card.Title>
				<Card.Description
					>Receive email instructions to reset your password. <a
						href="/auth/sign-in"
						class="ml-auto inline-block text-sm underline"
					>
						Back to Sign in
					</a></Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field name="email" {form}>
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="w-full">
					<Form.Button class="w-full" disabled={$delayed}
						>{#if $delayed}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait{:else}Send Password Reset Email{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
