<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import CurrencyIcon from 'lucide-svelte/icons/currency';
	import type { FollowerCreditBalanceDetail } from '$lib/schema/credit.schema';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { User } from 'lucia';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import DateFormatter from '$lib/components/base/DateFormatter.svelte';
	import SimpleDialog from '../../../components/SimpleDialog.svelte';

	export let availableCredits = 0;
	export let user: User;

	let creditDetailList: FollowerCreditBalanceDetail[];
	let showDialog = false;

	async function loadHistory() {
		try {
			const response = await fetch('/api/credits/credits-received', {
				method: 'POST',
				body: JSON.stringify({
					followerId: user.id
				})
			});
			if (!response.ok) throw new Error('Failed to fetch data');
			var result = await response.json();
			creditDetailList = result.credit;
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
		<Card.Title class="text-sm font-medium">Available Effort Credits</Card.Title>
		<CurrencyIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<Button on:click={() => (showDialog = true)} variant="link">
			<div class="text-2xl font-bold text-primary">{availableCredits} Credits</div>
		</Button>
	</Card.Content>
</Card.Root>

<SimpleDialog bind:showDialog title="Follower List" description="See your list of followers below">
	{#if creditDetailList}
		<div>
			<Card.Root class="xl:col-span-2">
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Date</Table.Head>
								<Table.Head>Amount</Table.Head>
								<Table.Head>Creator</Table.Head>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{#each creditDetailList as credit}
								<Table.Row>
									<Table.Cell>
										<DateFormatter date={credit.date} />
									</Table.Cell>
									<Table.Cell>
										<RewardCurrency amount={credit.balance} name={credit.reward_name} />
									</Table.Cell>
									<Table.Cell>
										<a href="/market/{credit.creator_user_id}"> {credit.store_name}</a>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</div>
	{:else}
		<Alert variant="default">No credits distributed</Alert>
	{/if}
</SimpleDialog>
