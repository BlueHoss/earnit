<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInSchema, type SignInSchema } from '$lib/config/zod-schemas';
	import { pendingActions } from '$lib/stores/pending-action.store';
	import type { ActionResult } from '@sveltejs/kit';
	import { redirectWithRefresh } from '$lib/utils/redirect-with-refresh';
	import { goto } from '$app/navigation';

	export let data: SuperValidated<Infer<SignInSchema>>;

	const form = superForm(data, {
		validators: zodClient(signInSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false,
		onResult: ({ result }) => {
			// Check if the form submission was successful
			if (result.type === 'success') {
				handlePendingActions(result);
			}
		}
	});

	const { form: formData, enhance, validate } = form;

	async function handlePendingActions(result: ActionResult) {
		const actions = pendingActions.getActions();
		for (const action of actions) {
			if (action.type === 'REDEEM_PRODUCT') {
				pendingActions.clearActions();
				redirectWithRefresh(
					`/public/market/${action.payload.creatorId}/offering/${action.payload.productId}`
				);
				return;
			} else if (action.type === 'FOLLOW_CREATOR') {
				if (result.data.form.data.id != action.payload.creatorId) {
					pendingActions.clearActions();
					redirectWithRefresh(`/public/market/${action.payload.creatorId}`);
					return;
				}
			}
		}

		//Fallthrough if no redirect pending actions...
		if (result.data.form.data.is_creator) {
			redirectWithRefresh('/creator');
		}

		if (result.data.form.data.is_follower) {
			redirectWithRefresh('/follower');
		}
	}
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
