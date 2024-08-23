<!-- Page Marketplace -->
<script lang="ts">
	import Activity from 'lucide-svelte/icons/activity';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import Users from 'lucide-svelte/icons/users';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share';
	import FilmIcon from 'lucide-svelte/icons/film';
	import FollowIcon from 'lucide-svelte/icons/user-round-check';
	import CommentIcon from 'lucide-svelte/icons/message-square-more';
	import CopyIcon from 'lucide-svelte/icons/copy';
	import SendIcon from 'lucide-svelte/icons/send';

	import { Button } from '$lib/components/ui/button/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import EditMissionItem from './components/EditMissionItem.svelte';
	import MeritOfferingCard from '$lib/components/base/MeritOfferingCard.svelte';
	import PageHeader from '$lib/components/base/PageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';

	let copyButtonText = 'Copy profile link';
	function copyText(text: any) {
		navigator.clipboard
			.writeText(text)
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
</script>

<PageWrapper>
	<div class="flex items-center justify-between">
		<!-- Left Section: Profile Picture and Title -->
		<PageHeader Title="Marketplace" />

		<!-- Right Section: Buttons stacked vertically -->
		<div class="flex flex-col space-y-2">
			<Button
				on:click={() => copyText('https://app.earnitrewards.com/profile/brett')}
				class="flex items-center px-6 py-2"
			>
				<CopyIcon class="pr-1" /> Copy profile link
			</Button>
			<Button class="flex items-center px-6 py-2">
				<SendIcon class="pr-1" /> Share
			</Button>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Available Credits</Card.Title>
				<CurrencyIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">+600</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Merit Offerings</Card.Title>
				<Users class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">4</div>
				<!-- <p class="text-xs text-muted-foreground">Edit merit offerings amounts below</p> -->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Redeemed Products</Card.Title>
				<CreditCard class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">52</div>
				<!-- <p class="text-xs text-muted-foreground">
					<Button variant="outline" class="hover:text-primary">View Breakdown</Button>
				</p> -->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Subscribers</Card.Title>
				<Activity class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">35</div>
				<!-- <p class="text-xs text-muted-foreground">+6 this month</p> -->
			</Card.Content>
		</Card.Root>
	</div>
	<div>
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Merit Offerings</Card.Title>
					<Card.Description
						>All of your Merit Offerings that are displayed in your Marketplace</Card.Description
					>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				<MeritOfferingCard CardName="Facebook Course" EffortCredit="27" />
				<MeritOfferingCard CardName="Google Ads Course" EffortCredit="33" />
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
				<EditMissionItem name="Like Comment" icon={HeartIcon} value={2} />
				<EditMissionItem name="Like Video" icon={HeartIcon} value={2} />
				<EditMissionItem name="Like Photo" icon={HeartIcon} value={2} />
				<EditMissionItem name="Like Real" icon={FilmIcon} value={10} />
				<EditMissionItem name="Comment" icon={CommentIcon} value={6} />
				<!-- <EditMissionItem
					name="Comment ('I Love you ') expires in 12h 15m"
					icon={CommentIcon}
					value={15}
				/> -->
				<EditMissionItem name="Follow" icon={FollowIcon} value={3} />
				<!-- <EditMissionItem name="Share" icon={ShareIcon} value={10} /> -->
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
