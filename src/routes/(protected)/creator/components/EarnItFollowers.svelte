<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card/index.ts';
	import * as Table from '$lib/components/ui/table/index.ts';
	import Handle from '$lib/components/base/Handle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import FollowerIcon from 'lucide-svelte/icons/venetian-mask';

	let showDialog = false;

	export let followers: { handle: string }[];
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">Earn It Followers</Card.Title>
		<FollowerIcon class="h-4 w-4 text-muted-foreground" />
	</Card.Header>
	<Card.Content>
		<Button variant="link" on:click={() => (showDialog = true)}>
			<div class="text-2xl font-bold text-primary">{followers.length}</div>
		</Button>
		<!-- <p class="text-xs text-muted-foreground">+20.1% from last month</p> -->
	</Card.Content>
</Card.Root>

<Dialog.Root bind:open={showDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Follower List</Dialog.Title>
			<Dialog.Description>See your list of followers below</Dialog.Description>
		</Dialog.Header>
		<div>
			<Card.Root class="xl:col-span-2">
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Follower Handle</Table.Head>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{#each followers as follower}
								<Table.Row>
									<Table.Cell>
										<Handle handle={follower.handle} />
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
