<!-- Page Marketplace -->
<script lang="ts">
	import CopyIcon from 'lucide-svelte/icons/copy';
	import CopyCheckIcon from 'lucide-svelte/icons/copy-check';
	import NewTabIcon from 'lucide-svelte/icons/external-link';
	import SendIcon from 'lucide-svelte/icons/send';
	import TwitterIcon from '$lib/components/ui/svgIcons/TwitterIcon.svelte';
	import FacebookIcon from '$lib/components/ui/svgIcons/FacebookIcon.svelte';
	import LinkedInIcon from 'lucide-svelte/icons/linkedin';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import MeritOfferingCard from '$lib/components/base/MeritOfferingCard.svelte';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import CreatorProductCount from '../components/CreatorProductCount.svelte';
	import ProductsRedeemed from '../components/ProductsRedeemed.svelte';
	import Subscribers from '../components/Subscribers.svelte';
	import MissionActions from '$lib/components/base/MissionActions.svelte';
	import type { CreatorMarketplaceData } from '$lib/types';
	import type { User } from 'lucia';
	import CreatorMissions from '$lib/components/base/CreatorMissions.svelte';

	interface PageData {
		creatorMarketplaceData: CreatorMarketplaceData;
		user: User;
	}

	export let data: PageData;
	let creatorMarketplaceData: CreatorMarketplaceData;
	$: ({ creatorMarketplaceData, user } = data);

	let showShareDialog = false;

	let copyIcon = CopyIcon;

	const profileLink = PUBLIC_BASE_URL + '/market/' + data.user.id;

	function copyText() {
		navigator.clipboard
			.writeText(profileLink)
			.then(() => {
				copyIcon = CopyCheckIcon;

				setTimeout(() => {
					copyIcon = CopyIcon;
				}, 1000);
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}

	function openShareDialog() {
		showShareDialog = true;
	}
</script>

<PageWrapper>
	<!-- <div class="flex items-center justify-between"> -->
	<div class="flex flex-col sm:flex-row items-center justify-between">
		<!-- Left Section: Profile Picture and Title -->
		<PageHeaderCreator user={data.user} />

		<!-- Right Section: Buttons stacked vertically -->
		<div class="flex p-10 space-x-2">
			<Button on:click={() => copyText()}>
				<svelte:component this={copyIcon} />
			</Button>
			<Button href={profileLink} target="_blank">
				<NewTabIcon />
			</Button>
			<Button on:click={openShareDialog}>
				<SendIcon />
			</Button>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<CreatorProductCount productCount={creatorMarketplaceData.productCount} />
		<ProductsRedeemed totalRedeemed={creatorMarketplaceData.purchaseCount} />
		<Subscribers subscriberCount={creatorMarketplaceData.subscriberCount} />
	</div>
	<div>
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row justify-between">
				<div class="grid gap-2">
					<Card.Title>Merit Offerings</Card.Title>
					<Card.Description
						>All of your Merit Offerings that are displayed in your Marketplace</Card.Description
					>
				</div>
				<Button href="/creator/marketplace/edit-product-0"><CirclePlus /> Add New Merit Item</Button
				>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{#each creatorMarketplaceData.products as product}
					<MeritOfferingCard user={data.user} {product} />
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
	<CreatorMissions user={data.user} missions={data.creatorMarketplaceData.missions} />
</PageWrapper>

<Dialog.Root bind:open={showShareDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share Profile</Dialog.Title>
			<Dialog.Description>Share your profile link on various platforms.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<Button class="w-full">
				<TwitterIcon className="mr-2" />
				Share on Twitter
			</Button>
			<Button class="w-full">
				<FacebookIcon className="mr-2" />
				Share on Facebook
			</Button>
			<Button class="w-full">
				<LinkedInIcon class="mr-2" />
				Share on LinkedIn
			</Button>
			<Button on:click={() => copyText()}>
				<svelte:component this={copyIcon} class="mr-2" />
				<span class="min-w-[100px] text-center">Copy Profile Link</span>
			</Button>
		</div>
		<Dialog.Footer>
			<Button on:click={() => (showShareDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
