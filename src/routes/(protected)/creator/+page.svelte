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

	export let data: PageData;
	$: ({ creatorDashboard } = data);
</script>

<PageWrapper>
	<PageHeader {data} Title="Dashboard" />
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<!-- <EffortCreditsAvailable effortCredits={600} /> -->
		<PaidSubscribers
			paidSubscribers={creatorDashboard.subscriberCount}
			totalMonthlyRevenue={creatorDashboard.revenue}
		/>
		<EffortCreditsThisMonth effortCredits={449} />
		<ProductsRedeemedThisMonth redeemedThisMonth={6} />
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
							<Table.Head class="text-right">Amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Liam Johnson</div>
								<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
							</Table.Cell>
							<Table.Cell class="text-right">250</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Olivia Smith</div>
								<div class="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
							</Table.Cell>
							<Table.Cell class="text-right">150</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Noah Williams</div>
								<div class="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
							</Table.Cell>
							<Table.Cell class="text-right">350</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Emma Brown</div>
								<div class="hidden text-sm text-muted-foreground md:inline">emma@example.com</div>
							</Table.Cell>
							<Table.Cell class="text-right">450</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<div class="font-medium">Liam Johnson</div>
								<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
							</Table.Cell>
							<Table.Cell class="text-right">550</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
