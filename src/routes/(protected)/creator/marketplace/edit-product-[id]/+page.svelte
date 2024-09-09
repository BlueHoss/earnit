<!-- Page Marketplace - Edit -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';

	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import UploadType from '$lib/components/base/ImageUpload.svelte';
	import ImageUpload from '$lib/components/base/ImageUpload.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import Marketplace from 'lucide-svelte/icons/store';
	import Captions from 'lucide-svelte/icons/captions';
	import FileText from 'lucide-svelte/icons/file-text';
	import Image from 'lucide-svelte/icons/image';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import MeritItem from '../components/MeritItem.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import { superForm, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productNewUpdateSchema } from '$lib/schema/product.schema.ts';
	//import type { ProductNewUpdateType } from '$lib/schema/product.schema.ts';
	import SuperDebug from 'sveltekit-superforms';
	import ButtonConfirmAction from '$lib/components/base/ButtonConfirmAction.svelte';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';

	export let data;
	export let fileUploadList: { id: number; name: string; file: File | null }[] = [];

	const form = superForm(data.form, {
		validators: zodClient(productNewUpdateSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false,
		onSubmit: ({ formData, cancel }) => {
			// Append each file and its metadata to formData
			fileUploadList.forEach((upload, index) => {
				formData.append(`productItems[${index}].name`, upload.name);
				if (upload.file) {
					formData.append(`productItems[${index}].file`, upload.file);
				}
			});

			// Add the number of productItems
			formData.append('productItemsCount', fileUploadList.length.toString());
		}
	});

	const { form: formData, errors, enhance, delayed } = form;

	console.log(data);
</script>

<PageWrapper>
	<form method="POST" id="productForm" action="?/update" use:enhance enctype="multipart/form-data">
		<!-- <SuperDebug data={$formData} />
		<SuperDebug data={$errors} /> -->

		<Label class="flex items-center text-2xl font-semibold">
			<Marketplace class="mr-2" />
			Add/Edit a Marketplace Offering
		</Label>
		<p class="text-md pb-5 text-gray-400">
			Use this page to add and modify your Marketplace offerings.
		</p>
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
					<Card.Title class="flex items-center"
						><CurrencyIcon class="mr-2" /> {data.user.reward_name}</Card.Title
					>
					<Card.Description
						>The number of credits required for followers to redeem this Merit Offering.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Card.Content>
						<Form.Field name="cost" {form} class="flex-1">
							<Form.Control let:attrs>
								<Input type="number" {...attrs} bind:value={$formData.cost} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Card.Content>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="grid grid-cols-1 pt-5 gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"
						><FileText class="mr-2" />Item Description</Card.Title
					>
					<Card.Description>
						The 500 word description shown for this item on the marketplace.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col gap-4">
						<Card.Content>
							<Form.Field name="description" {form} class="flex-1">
								<Form.Control let:attrs>
									<Textarea rows={20} {...attrs} bind:value={$formData.description} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</Card.Content>
						<p class="text-sm text-muted-foreground">
							The first 30 characters are shown in the marketplace listings view.
						</p>
					</div>
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
					<ImageUpload
						title="Upload your product image"
						bind:imageUrl={$formData.cover_image}
						uploadType="product_image"
					/>
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
					<MeritItem bind:uploads={$formData.productItems} />
				</Card.Content>
			</Card.Root>
		</div>

		<div class="mt-8 flex justify-end space-x-4">
			<form id="deleteForm" method="POST" action="?/delete" use:enhance>
				<ButtonConfirmAction
					buttonText="Delete Product"
					warningText="Are you sure you want to delete this product?"
					callBack={() => {
						var deleteForm = document.getElementById('deleteForm');
						if (deleteForm) {
							deleteForm.submit();
						}
					}}
				></ButtonConfirmAction>
			</form>
			<Button on:click={() => window.history.back()} variant="secondary">Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
</PageWrapper>
