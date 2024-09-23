<!-- Page EDIT PROFILE -->
<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import NameIcon from 'lucide-svelte/icons/circle-user';
	import ProfileIcon from 'lucide-svelte/icons/user';
	import TitleIcon from 'lucide-svelte/icons/award';
	import BioIcon from 'lucide-svelte/icons/book-user';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import { profileEditSchema } from '$lib/schema/login.schema.js';
	import ImageUpload from '$lib/components/base/ImageUpload.svelte';

	export let data; //: SuperValidated<Infer<UserProfile>>;

	const form = superForm(data.form, {
		validators: zodClient(profileEditSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});
	const { form: formData, errors, enhance, delayed } = form;

	function goBack() {
		window.history.back();
	}
</script>

<PageWrapper>
	<form method="POST" use:enhance>
		<Label class="flex items-center text-2xl pb-4 font-semibold">
			<Avatar class="h-24 w-24 mr-5">
				<AvatarImage src={data.user?.profile_pic} alt="Your Profile Picture" />
				<AvatarFallback>{data.user?.initials}</AvatarFallback>
			</Avatar>
			Edit your Earn It Profile
		</Label>
		<p class="text-md text-gray-400">Use this page modify your Earn It profile.</p>
		{#if $errors._errors}
			<div class="error">
				{#each $errors._errors as error}
					<p>Error: {error}</p>
				{/each}
			</div>
		{/if}
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><NameIcon class="mr-2" /> Your name</Card.Title>
				<Card.Description>Edit your name</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<Form.Field name="first_name" {form} class="flex-1">
							<Form.Control let:attrs>
								<Form.Label>First Name</Form.Label>
								<Input {...attrs} bind:value={$formData.first_name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div>
						<Form.Field name="last_name" {form} class="flex-1">
							<Form.Control let:attrs>
								<Form.Label>Last Name</Form.Label>
								<Input {...attrs} bind:value={$formData.last_name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"
					><TitleIcon class="mr-2" />Your Instagram Handle</Card.Title
				>
				<Card.Description
					>Your unique identifier on Instagram, which appears at the top of your profile and is
					preceded by an "@" symbol.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<Form.Field name="social_media_profile" {form} class="flex-1">
					<Form.Control let:attrs>
						<Form.Label>Your Instagram Handle</Form.Label>
						<Input {...attrs} bind:value={$formData.social_media_profile} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<p>
					This must match your Instagram handle exactally in order for Earn It to award your
					followers with credits for performing actions.
				</p>
			</Card.Content>
		</Card.Root>

		<div class="mt-8 flex justify-end space-x-4">
			<Button on:click={goBack} variant="secondary">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
	<!-- <SuperDebug data={$formData} /> -->
</PageWrapper>
