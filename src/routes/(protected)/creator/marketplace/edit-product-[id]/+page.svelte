<!-- Page Marketplace - Edit -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';

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
	import { superForm, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productCreateSchema } from '$lib/schema/product.schema.ts';
	import type { ProductCreateType } from '$lib/schema/product.schema.ts';
	import SuperDebug from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(productCreateSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});

	// export let data; //: SuperValidated<Infer<ProductCreateType>>;

	// const form = superForm(data.form, {
	// 	validators: zodClient(productCreateSchema),
	// 	onUpdate: ({ form }) => {
	// 		// Convert cost to number before validation
	// 		form.cost = form.cost ? parseFloat(form.cost) : null;
	// 	},
	// 	dataType: 'json',
	// 	invalidateAll: false,
	// 	resetForm: false
	// });
	const { form: formData, errors, enhance, delayed } = form;
</script>

<PageWrapper>
	<form method="POST" use:enhance>
		<SuperDebug data={$formData} />
		<SuperDebug data={$errors} />

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
					<Form.Field name="name" {form} class="flex-1">
						<Form.Control let:attrs>
							<Input {...attrs} bind:value={$formData.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"><Currency class="mr-2" /> Effort Credits</Card.Title
					>
					<Card.Description
						>The number of credits required for followers to redeem this Merit Offering.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Card.Content>
						<Form.Field name="cost" {form} class="flex-1">
							<Form.Control let:attrs>
								<Input {...attrs} bind:value={$formData.cost} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
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
					<Card.Content>
						<Form.Field name="description" {form} class="flex-1">
							<Form.Control let:attrs>
								<Textarea {...attrs} bind:value={$formData.description} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
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
			<Button on:click={() => window.history.back()} variant="secondary">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
</PageWrapper>
