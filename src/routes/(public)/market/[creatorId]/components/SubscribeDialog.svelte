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

	let purchaseError: string = '';
	let planData: Plan[] = [];
	let selectedPlan: Plan | null = null;
	let isPurchasing: boolean = false;
	let purchaseSuccess: boolean = false;

	export let showSubscribeDialog = false;
	export let creator: Creator;
	export let user: User | null;

	function handlePlanChange(plan: Plan) {
		selectedPlan = plan;
	}

	async function loadPlanData() {
		try {
			const response = await fetch('/api/subscribe/subscribe-data');
			if (!response.ok) throw new Error('Failed to fetch data');
			var result = await response.json();
			planData = result.plans;
		} catch (e) {
			console.log(e);
		}
	}

	function handlePurchase() {
		return async ({ result }: { result: ActionResult }) => {
			// return async ({ result }) => {
			isPurchasing = false;
			if (result.type === 'success') {
				purchaseSuccess = true;
				purchaseError = '';
				await invalidateAll();
			} else if (result.type === 'failure') {
				purchaseError = result.data?.errors?.[0] || 'An error occurred';
			}
		};
	}

	$: if (showSubscribeDialog) {
		loadPlanData();
	}
</script>

<Dialog.Root bind:open={showSubscribeDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Become an Earner to {creator.store_name}!</Dialog.Title>
			<Dialog.Description>
				<p>Each Plan below unlocks more rewards from {creator.store_name}.</p>
				<br />
				<p>Top Earners are billed monthly. You can cancel anytime.</p>
			</Dialog.Description>
		</Dialog.Header>

		<Card class="mt-4">
			<CardContent class="m-4 gap-2">
				{#each planData as plan}
					<div class="flex justify-between items-center">
						<input
							type="radio"
							on:change={() => handlePlanChange(plan)}
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

		<div>
			<p>Credit Card Integration coming soon.</p>
		</div>

		{#if purchaseError}
			<Alert variant="destructive" class="mt-4">
				<AlertCircle class="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{purchaseError}</AlertDescription>
			</Alert>
		{/if}

		{#if purchaseSuccess}
			<Alert variant="default" class="mt-4">
				<CheckCircle2 class="h-4 w-4" />
				<AlertTitle>Success</AlertTitle>
				<AlertDescription
					>You have successfully become an Earner for {creator.store_name}!</AlertDescription
				>
			</Alert>
		{/if}

		<Dialog.Footer class="mt-4">
			{#if !purchaseSuccess}
				<Button variant="outline" on:click={() => (showSubscribeDialog = false)}>Cancel</Button>
				<form action="?/purchaseProduct" method="POST" use:enhance={handlePurchase}>
					<input type="hidden" name="planId" value={selectedPlan?.id} />
					<input type="hidden" name="creatorId" value={creator.id} />
					<input type="hidden" name="userId" value={user?.id} />
					<Button
						disabled={isPurchasing || purchaseSuccess || !selectedPlan || !user}
						hidden={purchaseSuccess}
						variant="default"
						type="submit"
						class="px-6 py-2"
					>
						{#if isPurchasing}
							Joining...
						{:else if purchaseSuccess}
							Joined!
						{:else}
							Join Now
						{/if}
					</Button>
				</form>
			{/if}
			{#if purchaseSuccess}
				<Button variant="default" on:click={() => window.location.reload()}>Close</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
