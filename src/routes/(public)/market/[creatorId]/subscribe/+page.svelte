<script lang="ts">
	import ButtonConfirmAction from '$lib/components/base/ButtonConfirmAction.svelte';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.ts';
	import LoadingIcon from 'lucide-svelte/icons/loader';
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements } from 'svelte-stripe';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_PUBLIC_KEY } from '$env/static/public';
	import { PaymentElement } from 'svelte-stripe';
	import { CheckCircle, X } from 'lucide-svelte';
	import type { Appearance, Stripe, StripeElements } from '@stripe/stripe-js';
	import type { PlanWithSubscription } from '$lib/schema/plan.schema';
	import * as Dialog from '$lib/components/ui/dialog';
	import SimpleDialog from '../../../../components/SimpleDialog.svelte';
	import DateFormatter from '$lib/components/base/DateFormatter.svelte';

	let clientSecret = '';
	let newSubscriptionId: string = '';
	let stripe: Stripe | null = null;
	let successUrl = '';
	let elements: StripeElements | null = null;
	let showPaymentDialog = false;
	let paymentIntentPromise: Promise<
		{ secret: string; returnUrl: string; subscriptionId: string } | undefined
	>;
	let showCurrentSubscriptionDialog = false;
	let stripeSubscription: any | null = null;
	let unsubscribeFormElement: HTMLFormElement;
	let testFormElement: HTMLFormElement;
	let subscribeFormElement: HTMLFormElement;
	let currentPlan: PlanWithSubscription | null | undefined;
	let selectedPlan: PlanWithSubscription | null;
	export let data;

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);
	});

	const appearance: Appearance = {
		theme: 'night' as const,
		labels: 'floating'
	};

	currentPlan = data.planData.SubscriberPlans.find((plan) => plan.currentPlan);
	selectedPlan = data.planData.SubscriberPlans[0];

	if (currentPlan) {
		selectedPlan = currentPlan;
	}

	async function createPaymentIntent() {
		if (selectedPlan === null || !stripe) {
			return;
		}

		const response = await fetch('/api/stripe/create-payment-intent', {
			method: 'POST',
			body: JSON.stringify({ planId: selectedPlan.id, creatorId: data.planData.Creator.id })
		});

		const { secret, returnUrl, subscriptionId } = await response.json();
		successUrl = returnUrl;
		clientSecret = secret;
		newSubscriptionId = subscriptionId;

		//elements = stripe.elements({ clientSecret: secret, appearance });
		return { secret, returnUrl, subscriptionId: subscriptionId };
	}

	async function getSubscriptionStatus(subscriptionId: string) {
		const response = await fetch('/api/stripe/get-subscription-status', {
			method: 'POST',
			body: JSON.stringify({ subscriptionId: subscriptionId })
		});

		const { subscription } = await response.json();
		return subscription;
	}

	async function submitPayment() {
		if (!stripe) {
			return;
		}

		// ask Stripe to confirm the payment
		const { error } = await stripe.confirmPayment({
			// pass instance that was used to create the Payment Element
			elements,

			// specify where to send the user when payment succeeeds
			confirmParams: {
				return_url: successUrl
			},
			metadata: {
				planId: selectedPlan?.id,
				creatorId: data.planData.Creator.id,
				planName: selectedPlan?.name
			}
		});

		if (error) {
			// handle error
			console.error(error);
		} else {
			if (subscribeFormElement) {
				subscribeFormElement.submit();
			}
		}
	}

	function selectPlan(plan: PlanWithSubscription) {
		selectedPlan = plan;
	}

	async function handlePlanPurchase() {
		if (currentPlan && currentPlan.stripe_subscription_id) {
			stripeSubscription = await getSubscriptionStatus(currentPlan.stripe_subscription_id);
			showCurrentSubscriptionDialog = true;
			return;
		}

		if (Number(selectedPlan?.plan_cost) === 0) {
			handleZeroCostPlan();
		} else {
			//submit payment intent
			showPaymentDialog = true;
		}
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			handleCancelPayment();
		}
	}

	async function handleZeroCostPlan() {
		showCurrentSubscriptionDialog = false;
		showPaymentDialog = false;
		if (subscribeFormElement) {
			subscribeFormElement.submit();
		}
	}

	async function handleChangePlanDialog() {
		if (Number(selectedPlan?.plan_cost) === 0) {
			handleZeroCostPlan();
		} else {
			//submit payment intent
			showCurrentSubscriptionDialog = false;
			showPaymentDialog = true;
		}
	}

	async function handleCancelPayment() {
		showPaymentDialog = false;
		if (newSubscriptionId) {
			const response = await fetch('/api/stripe/cancel-subscription', {
				method: 'POST',
				body: JSON.stringify({ subscriptionId: newSubscriptionId })
			});
		}
	}

	function submitTest() {
		if (testFormElement) {
			testFormElement.submit();
		}
	}

	function submitUnsubscribe() {
		if (unsubscribeFormElement) {
			unsubscribeFormElement.submit();
		}
	}

	function cancel() {
		window.history.back();
	}

	$: if (showPaymentDialog) {
		paymentIntentPromise = createPaymentIntent();
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
				<div class="flex justify-between items-center mb-2 space-x-4">
					<Button variant="secondary" on:click={cancel}>Go back</Button>
					<div>
						<form
							action="?/purchaseProduct"
							method="POST"
							bind:this={subscribeFormElement}
							on:submit|preventDefault
						>
							<input type="hidden" name="planId" value={selectedPlan?.id} />
							<input type="hidden" name="creatorId" value={data.creatorId} />
							<input type="hidden" name="userId" value={data.userId} />
							<input type="hidden" name="stripeSubscriptionId" value={newSubscriptionId} />
							<Button on:click={handlePlanPurchase}
								>Earn {data.planData.Creator.reward_name} Now!</Button
							>
						</form>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</PageWrapper>

<SimpleDialog
	bind:showDialog={showCurrentSubscriptionDialog}
	title="Become an Earner!"
	description="Existing subscription found."
>
	{#if currentPlan?.name === selectedPlan?.name}
		<p>
			You are currently subscribed to the {selectedPlan?.name} plan. If you want to upgrade or downgrade
			select a different plan.
		</p>
	{:else}
		{#if stripeSubscription}
			<p>
				You are currenty subscribed to the {currentPlan?.name} plan which expires on: <DateFormatter
					date=""
					epoch={stripeSubscription.current_period_end}
				/>
			</p>
			<p>
				You are about to change your plan to {selectedPlan?.name}. This will take effect immediatly.
				You still have
				<strong
					><DateFormatter
						date=""
						epoch={Number(stripeSubscription.current_period_end)}
						format="toNow"
					/>
				</strong>left of your current plan.
			</p>
		{/if}

		<Button on:click={handleChangePlanDialog} class="w-full"
			>Continue to {selectedPlan?.name} Payment</Button
		>
	{/if}
</SimpleDialog>

<Dialog.Root
	closeOnEscape={false}
	onOpenChange={handleOpenChange}
	closeOnOutsideClick={false}
	bind:open={showPaymentDialog}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Become an Earner</Dialog.Title>
			<Dialog.Description
				>Payment method for your {data.planData.Creator.store_name} subscription.</Dialog.Description
			>
		</Dialog.Header>
		<div>
			{#await paymentIntentPromise}
				<p><LoadingIcon class="animate-spin" /></p>
			{:then secret}
				{#if stripe}
					<form on:submit|preventDefault={submitPayment}>
						<!-- container for Stripe components -->
						<Elements {stripe} clientSecret={secret.secret} bind:elements>
							<!-- display payment related fields -->
							<PaymentElement />
						</Elements>

						<Button class="w-full mt-4" type="submit">Pay</Button>
					</form>
				{:else}
					Loading Stripe...
				{/if}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</div>
		<Dialog.Footer>
			<Button variant="secondary" on:click={handleCancelPayment}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
