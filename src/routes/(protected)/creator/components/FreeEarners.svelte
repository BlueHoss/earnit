<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import Handle from '$lib/components/base/Handle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Currency from '$lib/components/base/Currency.svelte';
	import PaidSubscribersIcon from 'lucide-svelte/icons/activity';

	let showDialog = false;

	export let subscribers: { handle: string }[];
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Free Earners</Card.Title>
		<PaidSubscribersIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<Button variant="link" on:click={() => (showDialog = true)}>
			<div class="text-2xl font-bold text-primary">{subscribers.length}</div>
		</Button>
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={showDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Follower List</Dialog.Title>
			<Dialog.Description>See your list of subscribers below</Dialog.Description>
		</Dialog.Header>
		<div>
			<Card.Root class="xl:col-span-2">
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Subscriber Handle</Table.Head>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{#each subscribers as sub}
								<Table.Row>
									<Table.Cell>
										<Handle handle={sub.handle} />
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
