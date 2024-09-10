<script lang="ts">
	import { type DefaultMissionAction } from '$lib/schema/mission.schema';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import FilmIcon from 'lucide-svelte/icons/film';
	import FollowIcon from 'lucide-svelte/icons/user-round-check';
	import CommentIcon from 'lucide-svelte/icons/message-square-more';
	import CirclePlusIcon from 'lucide-svelte/icons/circle-plus';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { User } from 'lucia';

	let isOpen = false;
	let currentAction: DefaultMissionAction | null = null;

	export let missionActions: DefaultMissionAction[] = [];
	export let user: User | null = null;

	$: missionActionsReactive = missionActions;

	async function updateMissionActionValue() {
		if (!currentAction) return;

		const response = await fetch('/api/mission-action', {
			method: 'POST',
			body: JSON.stringify({
				id: currentAction.id,
				value: currentAction.reward_per_day
			})
		});
		missionActionsReactive = missionActions;
		//const result = await response.json();
		isOpen = false;
	}

	function closeDrawer() {
		isOpen = false;
	}

	function openDialog(actionItem: DefaultMissionAction) {
		currentAction = actionItem;
		isOpen = true;
	}

	function setIcon(name: string) {
		name = name.toLowerCase();

		if (name.includes('follow')) {
			return FollowIcon;
		} else if (name.includes('comment')) {
			return CommentIcon;
		} else if (name.includes('like')) {
			return HeartIcon;
		} else if (name.includes('watch')) {
			return FilmIcon;
		} else {
			return CirclePlusIcon;
		}
	}
</script>

{#each missionActionsReactive as actionItem}
	<div class="flex items-center gap-4">
		<svelte:component this={setIcon(actionItem.name)} />
		<div class="grid gap-1">
			<p class="text-sm font-medium leading-none">{actionItem.name}</p>
		</div>
		<div class="ml-auto flex items-center justify-end space-x-2 font-medium">
			<span>{actionItem.reward_per_day}</span>
			{#if user && user.is_creator}
				<Button on:click={() => openDialog(actionItem)}>
					<Pencil class="h-5 w-5" />
				</Button>
			{/if}
		</div>
	</div>
{/each}

{#if currentAction}
	<Drawer.Root bind:open={isOpen}>
		<!-- <Drawer.Trigger>Open</Drawer.Trigger> -->
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Edit {currentAction.name} Credits</Drawer.Title>
				<Drawer.Description>
					<p>Change how much your followers earn for {currentAction.name}.</p>
					<Label for="value">Merit Mission Value</Label>
					<Input id="value" bind:value={currentAction.reward_per_day} />
				</Drawer.Description>
			</Drawer.Header>
			<Drawer.Footer>
				<div class="flex justify-end space-x-4">
					<Button on:click={updateMissionActionValue}>Submit</Button>
					<Button variant="secondary" on:click={closeDrawer}>Cancel</Button>
				</div>
				<!-- <Drawer.Close>Cancel</Drawer.Close> -->
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
