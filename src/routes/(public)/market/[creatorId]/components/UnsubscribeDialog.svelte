<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Card, CardContent, CardTitle, CardDescription } from '$lib/components/ui/card';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { AlertCircle, CheckCircle2 } from 'lucide-svelte';
	import AlertTitle from '$lib/components/ui/alert/alert-title.svelte';
	import AlertDescription from '$lib/components/ui/alert/alert-description.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Creator } from '$lib/schema/login.schema';
	import type { Plan } from '$lib/schema/plan.schema';
	import Currency from '$lib/components/base/Currency.svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import type { User } from 'lucia';

	let unsubscribeError: string = '';
	let planData: Plan[] = [];
	let isUnsubscribing: boolean = false;
	let unsubscribeSuccess: boolean = false;
	let selectedPlan: Plan | null = null;

	export let showUnsubscribeDialog = false;
	export let creator: Creator;
	export let user: User | null;

	function handlePlanChange(plan: Plan) {
		selectedPlan = plan;
	}

	async function loadPlanData() {
		try {
			const formData = new FormData();
			if (!user) return;
			formData.append('followerId', user.id.toString());
			formData.append('creatorId', creator.id.toString());

			const response = await fetch('/api/subscribe/subscribed-data', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Failed to fetch data');
			var result = await response.json();
			planData = result.plans;

			if (planData.length > 0) {
				selectedPlan = planData[0];
			}
		} catch (e) {
			//console.log(e);
		}
	}

	function handleUnsubscribe() {
		return async ({ result }: { result: ActionResult }) => {
			// return async ({ result }) => {
			isUnsubscribing = false;
			if (result.type === 'success') {
				unsubscribeSuccess = true;
				unsubscribeError = '';
				await invalidateAll();
			} else if (result.type === 'failure') {
				unsubscribeError = result.data?.errors?.[0] || 'An error occurred';
			}
		};
	}

	$: if (showUnsubscribeDialog) {
		loadPlanData();
	}
</script>

<Dialog.Root bind:open={showUnsubscribeDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Unsubscribe from {creator.store_name}?</Dialog.Title>
			<Dialog.Description>
				Your subscription will remain active until 30 days from your last payment. After this date,
				your subscription will end, and your card will not be charged again.
			</Dialog.Description>
		</Dialog.Header>

		<Card class="mt-4">
			<CardContent class="m-4 gap-2">
				{#each planData as plan}
					<div class="flex justify-between items-center">
						<input
							type="checkbox"
							on:change={() => handlePlanChange(plan)}
							checked={true}
							name="plan"
							value={plan.id}
						/>
						<span>{plan.name}</span>
						<span><Currency amount={Number(plan.plan_cost)} />/ Month</span>
					</div>
				{/each}

				{#if selectedPlan}
					<span>{selectedPlan.description}</span>
				{/if}
			</CardContent>
		</Card>

		{#if unsubscribeError}
			<Alert variant="destructive" class="mt-4">
				<AlertCircle class="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{unsubscribeError}</AlertDescription>
			</Alert>
		{/if}

		{#if unsubscribeSuccess}
			<Alert variant="default" class="mt-4">
				<CheckCircle2 class="h-4 w-4" />
				<AlertTitle>Success</AlertTitle>
				<AlertDescription>You have successfully unsubscribed from the plan.</AlertDescription>
			</Alert>
		{/if}

		<Dialog.Footer class="mt-4">
			{#if !unsubscribeSuccess}
				<Button variant="outline" on:click={() => (showUnsubscribeDialog = false)}>Cancel</Button>

				<form action="?/planUnsubscribe" method="POST" use:enhance={handleUnsubscribe}>
					<input type="hidden" name="planId" value={selectedPlan?.id} />
					<input type="hidden" name="creatorId" value={creator.id} />
					<input type="hidden" name="userId" value={user?.id} />
					<Button
						hidden={unsubscribeSuccess}
						disabled={isUnsubscribing || unsubscribeSuccess || !selectedPlan || !user}
						variant="default"
						type="submit"
						class="px-6 py-2"
					>
						{#if isUnsubscribing}
							Unsubscribing...
						{:else if unsubscribeSuccess}
							Unsubscribed
						{:else}
							Confirm Unsubscribe
						{/if}
					</Button>
				</form>
			{/if}
			{#if unsubscribeSuccess}
				<Button variant="default" on:click={() => window.location.reload()}>Close</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
