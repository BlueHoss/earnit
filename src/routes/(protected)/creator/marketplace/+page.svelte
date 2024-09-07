<!-- Page Marketplace -->
<script lang="ts">
	import CopyIcon from 'lucide-svelte/icons/copy';
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
	import EarnItFollowers from '../components/EarnItFollowers.svelte';
	import MissionActions from '$lib/components/base/MissionActions.svelte';
	import type { CreatorMarketplaceData } from '$lib/types';
	import type { User } from 'lucia';

	interface PageData {
		creatorMarketplaceData: CreatorMarketplaceData;
		user: User;
	}

	export let data: PageData;
	let creatorMarketplaceData: CreatorMarketplaceData;
	$: ({ creatorMarketplaceData, user } = data);

	let showShareDialog = false;

	const profileLink = PUBLIC_BASE_URL + '/public/market/' + data.user.id;
	let copyButtonText = 'Copy profile link';
	function copyText() {
		navigator.clipboard
			.writeText(profileLink)
			.then(() => {
				copyButtonText = 'Copied!';

				setTimeout(() => {
					copyButtonText = 'Copy profile link';
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
	<div class="flex items-center justify-between">
		<!-- Left Section: Profile Picture and Title -->
		<PageHeaderCreator user={data.user} />

		<!-- Right Section: Buttons stacked vertically -->
		<div class="flex flex-col space-y-2">
			<Button on:click={() => copyText()} class="flex items-center justify-center px-6 py-2 w-full">
				<CopyIcon class="mr-2" />
				<span class="min-w-[100px] text-center">{copyButtonText}</span>
			</Button>
			<Button class="flex items-center justify-center px-6 py-2 w-full" on:click={openShareDialog}>
				<SendIcon class="mr-2" />
				<span class="min-w-[100px] text-center">Share</span>
			</Button>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<CreatorProductCount productCount={creatorMarketplaceData.productCount} />
		<ProductsRedeemed totalRedeemed={creatorMarketplaceData.purchaseCount} />
		<Subscribers subscriberCount={creatorMarketplaceData.subscriberCount} />
		<EarnItFollowers followers={creatorMarketplaceData.followerCount} />
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
	<div class="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
		<Card.Root>
			<Card.Header>
				<Card.Title>Instagram Merit Mission</Card.Title>
				<Card.Description
					>You can edit how many Merit Credits each Mission is worth.
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<MissionActions missionActions={creatorMarketplaceData.missionActionItems} />
			</Card.Content>
		</Card.Root>
	</div>
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
				<CopyIcon class="mr-2" />
				<span class="min-w-[100px] text-center">{copyButtonText}</span>
			</Button>
		</div>
		<Dialog.Footer>
			<Button on:click={() => (showShareDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
