<!-- Page Marketplace -->
<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import HeartIcon from 'lucide-svelte/icons/heart';
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
						<AvatarImage src={data.creator.profile_pic} alt="{data.creator.name} Profile Picture" />
						<AvatarFallback>SM</AvatarFallback>
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
					<Button class="px-6"><FollowEarnItIcon class="pr-1" />Follow</Button>
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
					<MeritOfferingCard {data} {product} />
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
	<div class="grid gap-4 md:gap-8">
		<Card.Root class="w-80">
			<Card.Header>
				<Card.Title>{data.name}'s Instagram Merit Mission</Card.Title>
				<Card.Description
					>{data.name} has created a mission for you to complete on Instagram
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<MissionItem name="Like" icon={HeartIcon} value={2} />
				<MissionItem name="Comment" icon={CommentIcon} value={6} />
				<MissionItem name="Follow" icon={FollowIcon} value={3} />
				<MissionItem name="Share" icon={ShareIcon} value={10} />
				<MissionItem name="Like Real" icon={FilmIcon} value={10} />
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
