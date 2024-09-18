<script lang="ts">
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import CreditsDistributed from './components/CreditsDistributed.svelte';
	import ProductsRedeemedThisMonth from './components/ProductsRedeemedThisMonth.svelte';
	import PaidSubscribers from './components/PaidSubscribers.svelte';
	import EarnItFollowers from './components/EarnItFollowers.svelte';
	import NewTabIcon from 'lucide-svelte/icons/external-link';
	import SendIcon from 'lucide-svelte/icons/send';
	import CopyCheckIcon from 'lucide-svelte/icons/copy-check';
	import CopyIcon from 'lucide-svelte/icons/copy';

	import type { UserDashboardData } from '$lib/types/creator-dashabord';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import CreatorMissions from '$lib/components/base/CreatorMissions.svelte';
	import MeritOfferings from './components/MeritOfferings.svelte';
	export let data: UserDashboardData;

	const profileLink = PUBLIC_BASE_URL + '/market/' + data.user.id;
	let copyIcon = CopyIcon;

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
</script>

<PageWrapper>
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
		</div>
	</div>
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<!-- <EffortCreditsAvailable effortCredits={600} /> -->

		<CreditsDistributed effortCredits={data.dashboard.creditsDistributed} user={data.user} />
		<ProductsRedeemedThisMonth
			productPurchaseList={data.dashboard.productPurchaseList}
			redeemedThisMonth={data.dashboard.purchaseCount}
			purchaseAmount={data.dashboard.purchaseAmount}
		/>
		<EarnItFollowers followers={data.dashboard.followers} />
		<PaidSubscribers
			subscribers={data.dashboard.subscribers}
			totalMonthlyRevenue={data.dashboard.revenue}
		/>
	</div>
	<div>
		<MeritOfferings products={data.dashboard.products} user={data.user} />
	</div>
	<CreatorMissions user={data.user} missions={data.dashboard.missions} />
</PageWrapper>
