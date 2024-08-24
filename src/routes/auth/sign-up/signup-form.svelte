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

<!--<Button on:click={() => goto('/auth/oauth/google')}>Sign up with Google</Button>-->
<div class="flex items-center justify-center mx-auto max-w-2xl">
	<Form.Root let:submitting let:errors method="POST" {form} schema={signUpSchema} let:config>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description
					>Already have an account? <a href="/auth/sign-in" class="underline">Sign in here.</a
					></Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if errors?._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>
							{#each errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}
				<Form.Field {config} name="firstName">
					<Form.Item>
						<Form.Label>First Name</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="lastName">
					<Form.Item>
						<Form.Label>Last Name</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label>Password</Form.Label>
						<Form.Input type="password" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="terms">
					<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
						<Form.Checkbox />
						<div class="space-y-1 leading-none">
							<Form.Label>I Accept the terms and privacy policy.</Form.Label>
							<Form.Description>
								You agree to the <a href="/terms" class="text-primaryHover underline">terms</a> and
								<a href="/privacy" class="text-primaryHover underline">privacy policy</a>.
							</Form.Description>
						</div>
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={submitting}
					>{#if submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Please wait{:else}Sign Up{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>

{#if browser}
	<SuperDebug data={$formData} />
{/if}
