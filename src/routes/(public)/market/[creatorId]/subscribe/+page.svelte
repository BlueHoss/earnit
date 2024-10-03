<script lang="ts">
	import { enhance } from '$app/forms';
	import ButtonConfirmAction from '$lib/components/base/ButtonConfirmAction.svelte';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { type ActionResult } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	import { CheckCircle, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	let unsubscribeFormElement: HTMLFormElement;

	let currentPlan = data.planData.SubscriberPlans.find((plan) => plan.currentPlan);
	let selectedPlan = data.planData.SubscriberPlans[0];
	if (currentPlan) {
		selectedPlan = currentPlan;
	}

	function selectPlan(plan) {
		selectedPlan = plan;
	}

	function handlePurchase() {
		return async ({ result }: { result: ActionResult }) => {
			console.log('result from subscribe:', result);
			if (result.type === 'success') {
				await goto('/market/' + data.creatorId);
			} else if (result.type === 'failure') {
				toast.error(result.data?.errors?.[0] || 'An error occurred');
			}
		};
	}

	function submitUnsubscribe() {
		if (unsubscribeFormElement) {
			unsubscribeFormElement.submit();
		}
	}

	function cancel() {
		window.history.back();
	}
</script>

<PageWrapper>
	<PageHeaderCreator user={data.planData.Creator} />

	<Card.Root>
		<Card.Header>
			<Card.Title>Modify your Earner plan at {data.planData.Creator.store_name}</Card.Title>
			<Card.Description></Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-8">
			<p>
				{data.planData.Creator.store_name} offers a max of {data.planData.CreatorMissionCredits}
				{data.planData.Creator.reward_name}
				per day. Select a plan to increase your % of {data.planData.Creator.reward_name} earned per day.
			</p>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each data.planData.SubscriberPlans as plan}
					<div
						class="relative flex flex-col cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
						class:bg-ring={selectedPlan === plan}
						class:bg-accent={selectedPlan !== plan}
						on:click={() => selectPlan(plan)}
						on:keypress={(e) => e.key === 'Enter' && selectPlan(plan)}
						tabindex="0"
						role="radio"
						aria-checked={selectedPlan === plan}
					>
						<div class="flex justify-between items-center mb-2">
							<div class="text-sm font-medium">
								{plan.name}
							</div>
							{#if selectedPlan === plan}
								<div class="shrink-0 text-white">
									<CheckCircle size={24} />
								</div>
							{/if}
						</div>
						<div class="text-1xl font-bold mb-2">
							{plan.plan_cost}<span class="text-sm font-normal">/ Month</span>
						</div>
						<ul class="mt-2 space-y-1 text-sm">
							{#each plan.features as feature}
								<li class="flex items-center">
									<CheckCircle size={16} class="mr-2 text-green-400" />
									{feature}
								</li>
							{/each}
							{#if currentPlan && currentPlan.name == plan.name}
								<li><Badge class="bg-primary text-white">Current Plan</Badge></li>
							{/if}
						</ul>
					</div>
				{/each}
			</div>
			<p class="mb-4 text-muted-foreground">Earners are billed monthly. You can cancel anytime.</p>
			<p class="mt-6 text-sm">Credit Card Integration coming soon.</p>
			<div class="mt-6 flex justify-between items-center">
				{#if currentPlan}
					<div>
						<form
							action="?/planUnsubscribe"
							method="POST"
							bind:this={unsubscribeFormElement}
							on:submit|preventDefault
						>
							<input type="hidden" name="planId" value={selectedPlan?.id} />
							<input type="hidden" name="creatorId" value={data.creatorId} />
							<input type="hidden" name="userId" value={data.userId} />
							<ButtonConfirmAction
								buttonText="Unsubscribe"
								variant="destructive"
								callBack={submitUnsubscribe}
								warningText="Are you sure you want to stop earning {data.planData.Creator
									.reward_name} from {data.planData.Creator
									.store_name}? Reminder: You can always move to the free plan."
							/>
						</form>
					</div>
				{/if}
				<div class="flex space-x-4">
					<Button variant="secondary" on:click={cancel}>Go back</Button>
					<div>
						<form action="?/purchaseProduct" method="POST" use:enhance={handlePurchase}>
							<input type="hidden" name="planId" value={selectedPlan?.id} />
							<input type="hidden" name="creatorId" value={data.creatorId} />
							<input type="hidden" name="userId" value={data.userId} />
							<Button type="submit">Earn {data.planData.Creator.reward_name} Now!</Button>
						</form>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</PageWrapper>
