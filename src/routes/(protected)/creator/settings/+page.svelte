<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Select from '$lib/components/ui/select/index.ts';
	import StoreIcon from 'lucide-svelte/icons/store';
	import CoinIcon from 'lucide-svelte/icons/coins';
	import DescriptionIcon from 'lucide-svelte/icons/file-text';
	import CategoryIcon from 'lucide-svelte/icons/tag';
	import SettingsIcon from 'lucide-svelte/icons/settings';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import ImageUpload from '$lib/components/base/ImageUpload.svelte';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	//import { storeSettingsSchema } from '$lib/schema/store.schema.js';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { baseUserModifedSchema, type BaseUser } from '$lib/schema/login.schema.js';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';

	interface PageData {
		form: BaseUser;
	}

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(baseUserModifedSchema),
		dataType: 'json',
		invalidateAll: false,
		resetForm: false
	});
	const { form: formData, errors, enhance, delayed } = form;

	$: user = $formData;
	$: reward_name = $formData.reward_name;

	function toNumber(value: string): number {
		const num = Number(value);
		return isNaN(num) ? 0 : num;
	}

	function goBack() {
		window.history.back();
	}
</script>

<PageWrapper>
	<form method="POST" action="?/updatesettings" use:enhance>
		<Label class="flex items-center text-2xl pb-4 font-semibold">
			<StoreIcon class="h-24 w-24 mr-5" />
			Edit your Store Settings
		</Label>
		<p class="text-md text-gray-400">Configure your store and reward settings here.</p>
		{#if $errors._errors}
			<div class="error">
				{#each $errors._errors as error}
					<p>Error: {error}</p>
				{/each}
			</div>
		{/if}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"
						><StoreIcon class="mr-2" /> Store Information</Card.Title
					>
					<Card.Description
						>Your store information is displayed at the top of your marketplace. See the sample
						store below for an example.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Form.Field name="store_name" {form} class="flex-1">
						<Form.Control let:attrs>
							<Form.Label>Store Name</Form.Label>
							<Input {...attrs} bind:value={$formData.store_name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field name="title" {form} class="flex-1">
						<Form.Control let:attrs>
							<Form.Label>Title</Form.Label>
							<Input {...attrs} bind:value={$formData.title} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field name="follower_count" {form} class="flex-1">
						<Form.Control let:attrs>
							<Form.Label>Total Social Media Follower Count</Form.Label>
							<Input
								type="number"
								{...attrs}
								bind:value={$formData.follower_count}
								on:input={(e) => ($formData.follower_count = toNumber(e.currentTarget.value))}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- <Form.Field name="storeDescription" {form} class="flex-1 mt-4">
					<Form.Control let:attrs>
						<Form.Label>Store Description</Form.Label>
						<Textarea
							placeholder="Describe your store..."
							{...attrs}
							bind:value={$formData.storeDescription}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field> -->

					<PageHeaderCreator bind:user />
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"><CoinIcon class="mr-2" /> Reward Credits</Card.Title
					>
					<Card.Description>
						<p>
							Customize your credit name. When followers or subscribers interact with your social
							media content they are awarded credits. They can only earn and use your credits.
						</p>

						<p>This name will be displayed within Earn It when your credits are mentioned.</p>
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Form.Field name="reward_name" {form} class="flex-1">
						<Form.Control let:attrs>
							<Form.Label>Credit Name</Form.Label>
							<Input {...attrs} bind:value={$formData.reward_name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div class="flex text-2xl justify-center items-center h-16">
						<RewardCurrency amount={100} bind:name={reward_name} />
					</div>
				</Card.Content>
			</Card.Root>
			<!-- 
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center"><CategoryIcon class="mr-2" /> Category</Card.Title>
					<Card.Description>Select the category that best fits your store.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Form.Field name="category" {form} class="flex-1">
						<Form.Control let:attrs>
							<Select.Root bind:value={$formData.category}>
								<Select.Trigger>
									<Select.Value placeholder="Select a category" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="education">Education</Select.Item>
									<Select.Item value="fitness">Fitness</Select.Item>
									<Select.Item value="art">Art & Creativity</Select.Item>
									<Select.Item value="technology">Technology</Select.Item>
									<Select.Item value="lifestyle">Lifestyle</Select.Item>
								</Select.Content>
							</Select.Root>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root> -->
		</div>

		<!-- <Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center"
					><SettingsIcon class="mr-2" />Additional Settings</Card.Title
				>
				<Card.Description>Configure additional store settings.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center space-x-2">
					<Switch id="autoApprove" bind:checked={$formData.autoApprove} />
					<Label for="autoApprove">Auto-approve new followers</Label>
				</div>
				<div class="flex items-center space-x-2 mt-4">
					<Switch id="notificationsEnabled" bind:checked={$formData.notificationsEnabled} />
					<Label for="notificationsEnabled">Enable email notifications</Label>
				</div>
			</Card.Content>
		</Card.Root> -->

		<!-- <Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center">Store Banner Image</Card.Title>
				<Card.Description>
					Upload a banner image for your store. This will be displayed at the top of your store
					page.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<ImageUpload
					title="Upload your store banner!"
					uploadType="store_banner"
					bind:imageUrl={$formData.storeBanner}
				/>
			</Card.Content>
		</Card.Root> -->

		<div class="mt-8 flex justify-end space-x-4">
			<Button on:click={goBack} variant="secondary">Cancel</Button>
			<Button type="submit">Save Changes</Button>
		</div>
	</form>
	<!-- <SuperDebug data={$formData} />
	<SuperDebug data={$errors} /> -->
</PageWrapper>
