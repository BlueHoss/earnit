<!-- Page EDIT PROFILE -->
<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import Marketplace from 'lucide-svelte/icons/store';
	import NameIcon from 'lucide-svelte/icons/circle-user';
	import TitleIcon from 'lucide-svelte/icons/award';
	import BioIcon from 'lucide-svelte/icons/book-user';
	import JobDescIcon from 'lucide-svelte/icons/file-cog';
	import FileText from 'lucide-svelte/icons/file-text';
	import Image from 'lucide-svelte/icons/image';
	import Currency from 'lucide-svelte/icons/currency';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import Profile from 'lucide-svelte/icons/user';
	import { updateBaseUserSchema } from '$lib/schema/login.schema';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import ImageUpload from '$lib/components/base/ImageUpload.svelte';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(updateBaseUserSchema),
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
		<Label class="flex items-center text-2xl font-semibold">
			<Profile class="mr-2 h-32 w-32" />
			Edit your Earn It Profile
		</Label>
		<p class="text-md text-gray-400">Use this page modify your public Earn It profile.</p>
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><NameIcon class="mr-2" /> Your name</Card.Title>
				<Card.Description>This is the public name listed in the Marketplace.</Card.Description>
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
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center">Primary Profile Image</Card.Title>
				<Card.Description>
					Your primary profile image. This is the public image used for your profile everywhere in
					Earn It.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<ImageUpload
					title="Upload your profile pic!"
					uploadType="profile_image"
					bind:imageUrl={$formData.profile_pic}
				/>
			</Card.Content>
		</Card.Root>

		<div class="mt-8 flex justify-end space-x-4">
			<Button variant="secondary" on:click={goBack}>Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
</PageWrapper>

<!-- <SuperDebug data={$formData} />
<SuperDebug data={$errors} /> -->
