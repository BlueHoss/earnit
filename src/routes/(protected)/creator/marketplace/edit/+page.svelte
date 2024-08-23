<!-- Page Marketplace - Edit -->
<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import Marketplace from 'lucide-svelte/icons/store';
	import Captions from 'lucide-svelte/icons/captions';
	import FileText from 'lucide-svelte/icons/file-text';
	import Image from 'lucide-svelte/icons/image';
	import Currency from 'lucide-svelte/icons/currency';
	import ImageUpload from '../components/ImageUpload.svelte';
	import MeritItem from '../components/MeritItem.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
</script>

<PageWrapper>
	<Label class="flex items-center text-2xl font-semibold">
		<Marketplace class="mr-2" />
		Add/Edit a Marketplace Offering
	</Label>
	<p class="text-md text-gray-400">Use this page to add and modify your Marketplace offerings.</p>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><Captions class="mr-2" /> Item Name</Card.Title>
				<Card.Description
					>This is the public title for this item shown on the marketplace.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<form>
					<Input placeholder="Offering Name" />
				</form>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"><Currency class="mr-2" /> Effort Credits</Card.Title>
				<Card.Description
					>The number of credits required for followers to redeem this Merit Offering.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<form>
					<Input type="number" placeholder="Effort Credits" />
				</form>
			</Card.Content>
		</Card.Root>
	</div>
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center"><FileText class="mr-2" />Item Description</Card.Title>
			<Card.Description>
				The 500 word description shown for this item on the marketplace.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="flex flex-col gap-4">
				<Textarea />
				<p class="text-sm text-muted-foreground">
					The first 30 characters are shown in the marketplace listings view.
				</p>
			</form>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center"><Image class="mr-2" />Cover Image</Card.Title>
			<Card.Description>
				Your cover image is the first thing people see when they view your item.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<ImageUpload />
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center"><Image class="mr-2" />Merit Item</Card.Title>
			<Card.Description>
				Earn It allows you to unloack many Merit Items in each Merit Offering. Add all of your
				digital products can be uploaded below.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<MeritItem />
		</Card.Content>
	</Card.Root>

	<div class="mt-8 flex justify-end space-x-4">
		<Button variant="secondary">Cancel</Button>
		<Button>Save</Button>
	</div>
</PageWrapper>
