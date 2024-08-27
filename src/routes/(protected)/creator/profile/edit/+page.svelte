<!-- Page EDIT PROFILE -->
<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import NameIcon from 'lucide-svelte/icons/circle-user';
	import TitleIcon from 'lucide-svelte/icons/award';
	import BioIcon from 'lucide-svelte/icons/book-user';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import Profile from 'lucide-svelte/icons/user';
	import ProfileImageUpload from './components/ProfileImageUpload.svelte';
	import { userProfile, type UserProfile } from '$lib/config/zod-schemas';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';

	export let data: SuperValidated<Infer<UserProfile>>;

	const form = superForm(data.form, {
		validators: zodClient(userProfile),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});
	const { form: formData, errors, enhance, delayed } = form;

	console.log(data);

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
		<p class="text-md text-gray-400">Use this page modify your public Earn It profile.</p>
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
				<Card.Description>These are the public names listed in the Marketplace.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Form.Field name="handle" {form} class="flex-1">
					<Form.Control let:attrs>
						<Form.Label>Handle</Form.Label>
						<div class="text-gray-400">This is the only public value shared on your profile.</div>
						<Input {...attrs} bind:value={$formData.handle} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="text-gray-400">Earn It followers can see your name.</div>
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
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"><TitleIcon class="mr-2" /> Title</Card.Title>
					<Card.Description>Your Title shown on your Profile Page</Card.Description>
				</Card.Header>
				<Card.Content>
					<Form.Field name="title" {form} class="flex-1">
						<Form.Control let:attrs>
							<Form.Label>Your professional title</Form.Label>
							<Input {...attrs} bind:value={$formData.title} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"><NameIcon class="mr-2" /> Tag Line</Card.Title>
					<Card.Description>This is your tagline shown on your profile page.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Form.Field name="tag_line" {form} class="flex-1">
						<Form.Control let:attrs>
							<Form.Label>Your marketplace tag line</Form.Label>
							<Input {...attrs} bind:value={$formData.tag_line} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>
		</div>
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><BioIcon class="mr-2" />Bio</Card.Title>
				<Card.Description>
					Your bio is a short description of yourself. It is shown on your profile page.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Form.Field name="bio" {form} class="flex-1">
					<Form.Control let:attrs>
						<Form.Label>Your bio</Form.Label>
						<Input {...attrs} bind:value={$formData.bio} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex flex-col gap-4">
					<Textarea />
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center">Primary Profile Image</Card.Title>
				<Card.Description>
					Your primary profile image. This is the public image used for your profile everywhere in
					Earn It.
				</Card.Description>
			</Card.Header>
			<Card.Content><ProfileImageUpload bind:profilePicUrl={$formData.profile_pic} /></Card.Content>
		</Card.Root>

		<div class="mt-8 flex justify-end space-x-4">
			<Button on:click={goBack} variant="secondary">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
	<!-- <SuperDebug data={$formData} /> -->
</PageWrapper>
