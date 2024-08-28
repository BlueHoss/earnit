<script lang="ts">
	export let data: SuperValidated<PasswordUpdate>;

	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import { passworUpdateSchema, type PasswordUpdate } from '$lib/schema/login.schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Input from '$lib/components/ui/input/input.svelte';

	const form = superForm(data, {
		validators: zodClient(passworUpdateSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});

	const { form: formData, errors, enhance, delayed } = form;
</script>

<div class="flex items-center justify-center mx-auto max-w-2xl">
	<form method="POST" use:enhance>
		{#if $errors}
			<span>{$errors}</span>
		{/if}
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Change Your Password</Card.Title>
				<Card.Description>Choose a new password for your account.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field name="password" {form}>
					<Form.Control let:attrs>
						<Form.Label>New Password</Form.Label>
						<Input type="password" {...attrs} bind:value={$formData.password} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field name="confirmPassword" {form}>
					<Form.Control let:attrs>
						<Form.Label>Confirm Password</Form.Label>
						<Input type="password" {...attrs} bind:value={$formData.confirmPassword} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="w-full">
					<Form.Button class="w-full" disabled={$delayed}
						>{#if $delayed}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait{:else}Update Password{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
