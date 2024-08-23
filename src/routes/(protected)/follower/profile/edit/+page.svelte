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
	import ProfileImageUpload from './components/ProfileImageUpload.svelte';
</script>

<PageWrapper>
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
			<form>
				<Label>First Name</Label>
				<Input placeholder="Suzy" />
				<Label>Last Name</Label>
				<Input placeholder="Mclean" />
			</form>
		</Card.Content>
	</Card.Root>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><TitleIcon class="mr-2" /> Title</Card.Title>
				<Card.Description>Your Title shown on your Profile Page</Card.Description>
			</Card.Header>
			<Card.Content>
				<form>
					<Input type="number" placeholder="Facebook Add Professional" />
				</form>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><NameIcon class="mr-2" /> Tag Line</Card.Title>
				<Card.Description>This is your tagline shown on your profile page.</Card.Description>
			</Card.Header>
			<Card.Content>
				<form>
					<Input placeholder="Helping businesses grow through Facebook Ads" />
				</form>
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
			<form class="flex flex-col gap-4">
				<Textarea
					value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam laborum voluptatibus quaerat officiis neque ipsum soluta omnis numquam dolores. Dicta totam atque nostrum labore nemo a minima fugit. Quasi, sapiente."
				/>
			</form>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center"><Image class="mr-2" />Primary Profile Image</Card.Title>
			<Card.Description>
				Your primary profile image. This is the public image used for your profile everywhere in
				Earn It.
			</Card.Description>
		</Card.Header>
		<Card.Content><ProfileImageUpload /></Card.Content>
	</Card.Root>

	<div class="mt-8 flex justify-end space-x-4">
		<Button variant="secondary" class="bg-gray-600">Cancel</Button>
		<Button class="bg-blue-600 ">Save</Button>
	</div>
</PageWrapper>
