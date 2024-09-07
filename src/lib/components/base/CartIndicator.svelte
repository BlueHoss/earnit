<script lang="ts">
	import CartIcon from 'lucide-svelte/icons/shopping-basket';
	import { cartStore } from '$lib/stores/cart.store';
	$: hasItems = $cartStore && $cartStore.length > 0;
</script>

<div class="relative">
	<CartIcon class="h-6 w-6" />
	{#if hasItems}
		<span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
	{/if}
</div>

<style>
	.relative {
		position: relative;
	}
	.absolute {
		position: absolute;
	}
	.-top-1 {
		top: -0.25rem;
	}
	.-right-1 {
		right: -0.25rem;
	}
	.h-3 {
		height: 0.75rem;
	}
	.w-3 {
		width: 0.75rem;
	}
	.rounded-full {
		border-radius: 9999px;
	}
	.bg-red-500 {
		background-color: #ef4444;
	}
</style>
