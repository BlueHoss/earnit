<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInSchema, type SignInSchema } from '$lib/config/zod-schemas';

	export let data;

	const { form, enhance, errors } = superForm(data.form, {
		validators: zodClient(signInSchema),
		dataType: 'json'
	});

	// const { form, errors, enhance } = superForm<SignInSchema>({
	// 	schema: signInSchema
	// });
	//const { form, enhance } = superForm<SignInSchema>(signInSchema);
</script>

<form method="POST">
	<div>
		<label for="email">Email</label>
		<input type="text" id="email" name="email" bind:value={$form.email} />
		{#if $errors.email}<span class="error">{$errors.email}</span>{/if}
	</div>

	<div>
		<label for="password">Password</label>
		<input type="text" id="password" name="password" bind:value={$form.name} />
		{#if $errors.name}<span class="error">{$errors.name}</span>{/if}
	</div>

	<button type="submit">Sign In</button>
</form>
