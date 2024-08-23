<script>
	import * as Card from '$lib/components/ui/card/index.ts';
	import UsersIcon from 'lucide-svelte/icons/users';
	import DollarSignIcon from 'lucide-svelte/icons/dollar-sign';
	import PaidSubscribersIcon from 'lucide-svelte/icons/activity';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
	import * as Table from '$lib/components/ui/table/index.ts';
	import PageHeader from '$lib/components/base/PageHeader.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
</script>

<PageWrapper>
	<PageHeader Title="Dashboard" />
	<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Available Effort Credits</Card.Title>
				<DollarSignIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">+600</div>
				<!-- <p class="text-xs text-muted-foreground">+20.1% from last month</p> -->
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Distributed this Month</Card.Title>
				<UsersIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">492</div>
				<p class="text-xs text-muted-foreground">+27.1% from last month</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Redeemed this Month</Card.Title>
				<CreditCardIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">622</div>
				<p class="text-xs text-muted-foreground">+119% from last month!</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Paid Subscribers</Card.Title>
				<PaidSubscribersIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-primary">5</div>
				<p class="text-xs text-muted-foreground">$325.00 / month</p>
			</Card.Content>
		</Card.Root>
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
