<script lang="ts">
	import { superForm, type SuperForm } from 'sveltekit-superforms/client';
	import { z } from 'zod';

	// Define your Zod schema
	const signInSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8)
	});

	type SignInSchema = z.infer<typeof signInSchema>;

	// Create the form with explicit typing
	const { form, errors, enhance } = superForm<SignInSchema>({
		schema: signInSchema
	}) as SuperForm<SignInSchema>;
</script>

<form use:enhance method="POST">
	<div>
		<label for="email">Email</label>
		<input type="email" id="email" name="email" bind:value={$form.email} />
		{#if $errors.email}<span class="error">{$errors.email}</span>{/if}
	</div>

	<div>
		<label for="password">Password</label>
		<input type="password" id="password" name="password" bind:value={$form.password} />
		{#if $errors.password}<span class="error">{$errors.password}</span>{/if}
	</div>

	<button type="submit">Sign In</button>
</form>
