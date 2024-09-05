<!-- Page Marketplace -->
<script lang="ts">
	import HeartIcon from 'lucide-svelte/icons/heart';
	import * as Dialog from '$lib/components/ui/dialog';
	import ShareIcon from 'lucide-svelte/icons/share';
	import FilmIcon from 'lucide-svelte/icons/film';
	import FollowIcon from 'lucide-svelte/icons/user-round-check';
	import CommentIcon from 'lucide-svelte/icons/message-square-more';
	import FollowEarnItIcon from 'lucide-svelte/icons/user-round-check';
	import PaidSubscribersIcon from 'lucide-svelte/icons/activity';
	import ProfileIcon from 'lucide-svelte/icons/person-standing';
	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import MeritOfferingCard from '$lib/components/base/MeritOfferingCard.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import MissionItem from './components/MissionItem.svelte';
	import Avatar from '$lib/components/ui/avatar/avatar.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import Number from '$lib/components/base/Number.svelte';
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import MissionActions from '$lib/components/base/MissionActions.svelte';

	let showDialog = false;

	export let data: PageData;

	async function handleFollow() {
		if (!data || !data.user) {
			showDialog = true;
			return;
		}

		const formData = new FormData();
		formData.append('creatorId', data.creator.id.toString());

		const response = await fetch('?/followCreator', {
			method: 'POST',
			body: formData
		});

		await invalidateAll();
	}
</script>

<PageWrapper>
	<Card.Root class="h-40">
		<!-- Adjust the height as needed -->
		<Card.Content class="h-full">
			<div class="flex h-full items-center justify-between">
				<!-- Left Section: Image and Text -->
				<div class="flex items-center space-x-4">
					<!-- Example Profile Component with Image and Text -->
					<Avatar class="h-24 w-24">
						<AvatarImage
							src={data.creator.profile_pic}
							alt="{data.creator.handle} Profile Picture"
						/>
						<AvatarFallback>{data.creator.handle}</AvatarFallback>
					</Avatar>
					<div>
						<h2 class="text-xl font-bold">{data.creator.handle} Marketplace</h2>
						<p class="text-sm text-gray-400">
							<Number amount={data.creator.follower_count} /> followers
						</p>
					</div>
				</div>

				<!-- Right Section: Follow Button -->
				<div class="flex flex-col space-y-2">
					<Button on:click={handleFollow} class="px-6"
						><FollowEarnItIcon class="pr-1" />Follow</Button
					>
					<Button class="px-6"><PaidSubscribersIcon class="pr-1" />Subscribe</Button>
					<a href="/profile/{data.creator.handle}">
						<Button class="px-6"><ProfileIcon class="pr-1" /> View Profile</Button></a
					>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<div>
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>{data.creator.handle}'s Merit Offerings</Card.Title>
					<Card.Description
						>All of your Merit Offerings that are displayed in your Marketplace</Card.Description
					>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{#each data.products as product}
					<a href="/public/market/{data.creator.id}/offering-{product.id}">
						<MeritOfferingCard user={data.creator} {product} />
					</a>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
	<div class="grid gap-4 md:gap-8">
		<Card.Root>
			<Card.Header>
				<Card.Title>{data.creator.handle}'s Instagram Merit Mission</Card.Title>
				<Card.Description
					>{data.creator.handle} has created a mission for you to complete on Instagram
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<MissionActions user={null} missionActions={data.missionActions} />
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>

<Dialog.Root bind:open={showDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Please Sign In or Sign Up</Dialog.Title>
			<Dialog.Description
				>In order to follow {data.creator.handle} please sign in or sign up.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<Button on:click={() => goto('/auth/sign-up?user_type=follower')} class="w-full"
				>Sign Up</Button
			>
			<Button on:click={() => goto('/auth/sign-in')}>Sign In</Button>
		</div>
		<Dialog.Footer>
			<Button on:click={() => (showDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
