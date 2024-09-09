<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto, invalidateAll } from '$app/navigation';
	import PageHeaderCreator from '$lib/components/base/PageHeaderCreator.svelte';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
	import type { ProductWithItemCount } from '$lib/schema/product.schema';
	import type { User } from 'lucia';
	import { Card, CardContent, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { pendingActions } from '$lib/stores/pending-action.store';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { AlertCircle, CheckCircle2 } from 'lucide-svelte';
	import AlertTitle from '$lib/components/ui/alert/alert-title.svelte';
	import AlertDescription from '$lib/components/ui/alert/alert-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import RewardCurrency from '$lib/components/base/RewardCurrency.svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { Title } from '$lib/components/ui/alert';

	let showLoginDialog = false;
	let showRedeemDialog = false;
	let isRedeeming = false;
	let redeemSuccess = false;
	let redeemError = '';
	let isOwned = false;

	interface PageData {
		creator: User;
		user: User | null;
		product: ProductWithItemCount;
		userCredits: number;
		products: { id: number }[];
	}

	export let data: PageData;

	function handleSignInRedeem() {
		pendingActions.addAction({
			type: 'REDEEM_PRODUCT',
			payload: { creatorId: data.creator.id, productId: data.product.id }
		});

		showLoginDialog = true;
	}

	function handleProductOwnership() {
		if (!data.user) isOwned = false;

		for (const product of data.products) {
			if (product.id === data.product.id) {
				isOwned = true;
			}
		}
	}

	function handleEnhance() {
		return async ({ result }: { result: ActionResult }) => {
			// return async ({ result }) => {
			isRedeeming = false;
			if (result.type === 'success') {
				redeemSuccess = true;
				redeemError = '';
				await invalidateAll();
			} else if (result.type === 'failure') {
				redeemError = result.data?.errors?.[0] || 'An error occurred';
			}
		};
	}

	function handleClose() {
		showRedeemDialog = false;
		isRedeeming = false;
		redeemSuccess = false;
		redeemError = '';
	}

	handleProductOwnership();
</script>

<PageWrapper>
	<PageHeaderCreator user={data.creator} />

	<Card class="mb-4 overflow-hidden">
		<CardContent class="p-0">
			<div class="flex flex-col md:flex-row">
				<div class="md:w-1/3 bg-gray-100 dark:bg-gray-800">
					<img
						src={data.product.cover_image}
						alt={data.product.name}
						class="w-full h-full object-cover"
					/>
				</div>
				<div class="flex flex-col justify-between p-6 md:w-2/3">
					<div class="space-y-4">
						<CardTitle class="text-3xl font-bold text-primary">{data.product.name}</CardTitle>
						<CardDescription class="text-sm text-gray-600 dark:text-gray-300">
							{data.product.description}
						</CardDescription>
						<div class="flex items-center space-x-2">
							<Badge variant="secondary" class="text-sm py-1">
								{data.product.item_count} Digital Downloads
							</Badge>
							<span class="text-sm text-gray-500">included with this product</span>
						</div>
					</div>
					<div class="mt-6 flex items-center justify-between">
						<Badge variant="outline" class="text-xl py-2 px-4">
							Effort Credits: {data.product.cost}
						</Badge>
						{#if data.user}
							{#if isOwned}
								<Title>You own this product</Title>
							{:else}
								<Button
									variant="default"
									class="px-6 py-2"
									on:click={() => (showRedeemDialog = true)}>Redeem</Button
								>
							{/if}
						{:else}
							<Button variant="default" on:click={handleSignInRedeem} class="px-6 py-2"
								>Sign In to Redeem</Button
							>
						{/if}
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</PageWrapper>

<Dialog.Root bind:open={showLoginDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Please Sign In or Sign Up</Dialog.Title>
			<Dialog.Description>
				<p>
					In order to redeem {data.product.name} you must be Signed In.
				</p>
				<p class="text-primary pt-10">After signing in you will be redirected to this product.</p>
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<Button on:click={() => goto('/auth/sign-up?user_type=follower')} class="w-full"
				>Sign Up</Button
			>
			<Button variant="secondary" on:click={() => goto('/auth/sign-in')}>Sign In</Button>
		</div>
		<Dialog.Footer>
			<Button on:click={() => (showLoginDialog = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showRedeemDialog} on:openChange={handleClose}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Redeem Product</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to redeem this product? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>

		<Card class="mt-4">
			<CardHeader>
				<CardTitle>{data.product.name}</CardTitle>
				<CardDescription>{data.product.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex justify-between items-center">
					<span>Cost:</span>
					<RewardCurrency amount={data.product.cost} />
				</div>
				<div class="flex justify-between items-center mt-2">
					<span>Your Credits:</span>
					<RewardCurrency amount={data.userCredits} />
				</div>
			</CardContent>
		</Card>

		{#if redeemError}
			<Alert variant="destructive" class="mt-4">
				<AlertCircle class="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{redeemError}</AlertDescription>
			</Alert>
		{/if}

		{#if redeemSuccess}
			<Alert variant="default" class="mt-4">
				<CheckCircle2 class="h-4 w-4" />
				<AlertTitle>Success</AlertTitle>
				<AlertDescription>You have successfully redeemed the product!</AlertDescription>
			</Alert>
		{/if}

		<Dialog.Footer class="mt-4">
			<Button variant="outline" on:click={handleClose}>Cancel</Button>

			<form action="?/redeemProduct" method="POST" use:enhance={handleEnhance}>
				<input type="hidden" name="productId" value={data.product.id} />
				<input type="hidden" name="creatorId" value={data.product.creator_user_id} />
				<Button
					disabled={isRedeeming || redeemSuccess}
					variant="default"
					type="submit"
					class="px-6 py-2"
					on:click={() => (showRedeemDialog = true)}
				>
					{#if isRedeeming}
						Redeeming...
					{:else if redeemSuccess}
						Redeemed
					{:else}
						Confirm Redemption
					{/if}
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
