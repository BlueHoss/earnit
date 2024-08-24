<script lang="ts">
	export let data: SuperValidated<Infer<SignInSchema>>;

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInSchema, type SignInSchema } from '$lib/config/zod-schemas';

	const form = superForm(data, {
		validators: zodClient(signInSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});

	const { form: formData, enhance, validate } = form;
</script>

<form method="POST" use:enhance action="?/signin">
	<div class="grid gap-4">
		<Form.Field name="email" {form}>
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="grid gap-2">
			<Form.Field name="password" {form}>
				<Form.Control let:attrs>
					<div class="flex items-center">
						<Form.Label>Password</Form.Label>
						<a href="/auth/password/reset" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input type="password" {...attrs} bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Button type="submit" class="w-full">Login</Button>
		<!-- <Button variant="outline" class="w-full">Login with Google</Button> -->
	</div>
</form>
<div class="mt-4 text-center text-sm">
	Don&apos;t have an account?
	<a href="/auth/sign-up" class="underline"> Sign up </a>
</div>
