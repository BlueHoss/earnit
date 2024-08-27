<script lang="ts">
	import type { PageData } from './$types';
	import type { CreatorDashboard } from '$lib/types';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import PageHeader from '$lib/components/base/PageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import EffortCreditsThisMonth from './components/EffortCreditsThisMonth.svelte';
	import ProductsRedeemedThisMonth from './components/ProductsRedeemedThisMonth.svelte';
	import PaidSubscribers from './components/PaidSubscribers.svelte';
	import EarnItFollowers from './components/EarnItFollowers.svelte';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import Handle from '$lib/components/base/Handle.svelte';
	import CreatorProfileHeader from './components/CreatorProfileHeader.svelte';

	export let data: PageData;
	$: ({ creatorDashboard } = data);
</script>

<PageWrapper>
	<PageHeader {data} Title="Dashboard" />
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<!-- <EffortCreditsAvailable effortCredits={600} /> -->

		<EffortCreditsThisMonth effortCredits={creatorDashboard.rewardsUsed} />
		<ProductsRedeemedThisMonth
			redeemedThisMonth={creatorDashboard.purchaseCount}
			purchaseAmount={creatorDashboard.purchaseAmount}
		/>
		<EarnItFollowers followers={creatorDashboard.followerCount} />
		<PaidSubscribers
			paidSubscribers={creatorDashboard.subscriberCount}
			totalMonthlyRevenue={creatorDashboard.revenue}
		/>
	</div>
	<div>
		<Card.Root class="xl:col-span-2">
			<Card.Header class="flex flex-row items-center">
				<div class="grid gap-2">
					<Card.Title>Redemptions</Card.Title>
					<Card.Description>Recent offerings redeemed from your store.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Redeemer</Table.Head>
							<Table.Head>Offering</Table.Head>
							<Table.Head class="text-right">Amount</Table.Head>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#each creatorDashboard.productPurchaseList as redemption}
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">{redemption.follower}</div>
									<div class="hidden text-sm text-muted-foreground md:inline">
										<Handle handle={redemption.handle} />
									</div>
								</Table.Cell>
								<Table.Cell>{redemption.product_name}</Table.Cell>
								<Table.Cell class="text-right">
									<RewardCurrency amount={redemption.cost} />
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
