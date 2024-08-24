<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInSchema, type SignInSchema } from '$lib/config/zod-schemas';
	import { browser } from '$app/environment';

	export let data: SuperValidated<Infer<SignInSchema>>;

	const form = superForm(data, {
		validators: zodClient(signInSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});

	const { form: formData, enhance, validate } = form;
</script>

<form method="POST" use:enhance action="?/signin" class="space-y-8">
	<Form.Field name="email" {form}>
		<Form.Control let:attrs>
			<Form.Label>email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field name="password" {form}>
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Update account</Form.Button>
</form>
<!-- 
{#if browser}
	<SuperDebug data={$formData} />
{/if} -->
