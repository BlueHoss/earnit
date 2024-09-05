<script lang="ts">
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signupSchema, type SignupUser } from '$lib/schema/login.schema';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	export let data: SuperValidated<SignupUser>;
	const user_type = $page.url.searchParams.get('user_type');

	const form = superForm(data, {
		validators: zodClient(signupSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});

	const { form: formData, errors, enhance, delayed } = form;

	if (user_type && user_type === 'creator') {
		$formData.is_creator = true;
	} else if (user_type && user_type === 'follower') {
		$formData.is_follower = true;
	}
</script>

<form method="POST" use:enhance action="?/signup">
	<Card.Root>
		<Card.Header class="space-y-1">
			<Card.Description
				>Already have an account? <a href="/auth/sign-in" class="underline">Sign in here.</a
				></Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-4">
			{#if $errors._errors}
				<div class="error">
					{#each $errors._errors as error}
						<p>Error: {error}</p>
					{/each}
				</div>
			{/if}
			<div class="flex flex-wrap gap-2">
				<Form.Field name="first_name" {form} class="flex-1">
					<Form.Control let:attrs>
						<Form.Label>First Name</Form.Label>
						<Input {...attrs} bind:value={$formData.first_name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="last_name" class="flex-1">
					<Form.Control let:attrs>
						<Form.Label>Last Name</Form.Label>
						<Input {...attrs} bind:value={$formData.last_name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input type="password" {...attrs} bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirmPassword">
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input type="password" {...attrs} bind:value={$formData.confirmPassword} />
				</Form.Control>
				{#if $errors.confirmPassword}<span class="error">{$errors.confirmPassword}</span>{/if}
				<Form.FieldErrors />
			</Form.Field>
			<h2>Are you a digital Creator or here to Follow a digital creator?</h2>
			{#if $errors.roleError}<span class="error">{$errors.roleError}</span>{/if}
			<Form.Field {form} name="is_creator">
				<Form.Control let:attrs>
					<div class="space-y-0.5">
						<Form.Label>Creator</Form.Label>
						<Switch includeInput {...attrs} bind:checked={$formData.is_creator} />
						<Form.Description>
							I am a creator and want to sell my products on the platform.
						</Form.Description>
					</div>
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="is_follower">
				<Form.Control let:attrs>
					<div class="space-y-0.5">
						<Form.Label>Follower</Form.Label>
						<Switch includeInput {...attrs} bind:checked={$formData.is_follower} />
						<Form.Description>
							I am a follower and want to follow creators on the platform.
						</Form.Description>
					</div>
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="terms">
				<Form.Control let:attrs>
					<Checkbox {...attrs} bind:checked={$formData.terms} />
					<Form.Label>I Accept the terms and privacy policy. Password</Form.Label>
					<Form.Description>
						You agree to the <a href="/terms" class="text-primaryHover underline">terms</a> and
						<a href="/privacy" class="text-primaryHover underline">privacy policy</a>.
					</Form.Description>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button class="w-full"
				>{#if $delayed}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Please wait{:else}Sign Up{/if}
			</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>

<style>
	.error {
		color: red;
		font-size: large;
	}
</style>
