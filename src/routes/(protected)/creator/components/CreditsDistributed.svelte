<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import type { User } from 'lucia';
	import type { CreditDistributed } from '$lib/schema/credit.schema';
	import Handle from '$lib/components/base/Handle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DateFormatter from '$lib/components/base/DateFormatter.svelte';

	export let effortCredits;
	export let user: User;

	let creditDistributedList: CreditDistributed[] = [];
	let showDialog = false;

	async function loadHistory() {
		try {
			const response = await fetch('/api/credits/credits-given', {
				method: 'POST',
				body: JSON.stringify({
					creatorId: user.id
				})
			});
			if (!response.ok) throw new Error('Failed to fetch data');
			var result = await response.json();
			creditDistributedList = result.credit;
		} catch (e) {
			console.log(e);
		}
	}

	$: if (showDialog) {
		loadHistory();
	}
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Credits Distributed</Card.Title>
		<CurrencyIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<Button variant="link" on:click={() => (showDialog = true)}>
			<div class="text-2xl font-bold text-primary"><RewardCurrency amount={effortCredits} /></div>
		</Button>
		<!-- <p class="text-xs text-muted-foreground">+27.1% from last month</p> -->
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={showDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Credits Distributed</Dialog.Title>
			<Dialog.Description>See your credit distribution details below</Dialog.Description>
		</Dialog.Header>
		<div>
			<Card.Root class="xl:col-span-2">
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Date</Table.Head>
								<Table.Head>Follower</Table.Head>
								<Table.Head class="hidden md:table-cell">Type</Table.Head>
								<Table.Head class="text-right">Amount</Table.Head>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{#each creditDistributedList as credit}
								<Table.Row>
									<Table.Cell>
										<DateFormatter date={credit.date} />
									</Table.Cell>
									<Table.Cell>
										<Handle handle={credit.to_user} />
									</Table.Cell>
									<Table.Cell class="hidden md:table-cell">
										{credit.transaction_type}
									</Table.Cell>
									<Table.Cell class="text-right">
										<RewardCurrency amount={Number(credit.amount)} />
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</div>

		<Dialog.Footer>
			<Button on:click={() => (showDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
