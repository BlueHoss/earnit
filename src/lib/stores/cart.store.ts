// stores/cart.ts
import type { Product } from '$lib/schema/product.schema';
import { writable } from 'svelte/store';

export const cartStore = writable<Product[]>([]);

export function addProduct(product: Product) {
	cartStore.update((currentProducts) => {
		if (currentProducts === null) {
			return [product];
		}
		return [...currentProducts, product];
	});
}
