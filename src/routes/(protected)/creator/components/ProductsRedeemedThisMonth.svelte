<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import MarketplaceIcon from 'lucide-svelte/icons/store';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Handle from '$lib/components/base/Handle.svelte';

	export let redeemedThisMonth;
	export let purchaseAmount;
	export let productPurchaseList;

	let showDialog = false;

	async function loadPurchaseHistory() {}

	$: if (showDialog) {
		loadPurchaseHistory();
	}
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Redeemed this Month</Card.Title>
		<MarketplaceIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<Button on:click={() => (showDialog = true)} class="flex justify-start" variant="link">
			<div class="text-2xl font-bold text-primary">{redeemedThisMonth}</div>
		</Button>
		<p class="text-xs text-muted-foreground flex gap-1 items-center">
			<RewardCurrency amount={purchaseAmount} /> this month
		</p>
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={showDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Share Profile</Dialog.Title>
			<Dialog.Description>Share your profile link on various platforms.</Dialog.Description>
		</Dialog.Header>
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
							{#each productPurchaseList as redemption}
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

		<Dialog.Footer>
			<Button on:click={() => (showDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
