// stores/flash.ts
import { writable } from 'svelte/store';

export interface Flash {
	message: string;
	type: string;
}

export const flashStore = writable<Flash | null>(null);

export function setFlash(message: string, type: string = 'info') {
	flashStore.set({ message, type });
	setTimeout(() => flashStore.set(null), 5000); // Auto-clear after 5 seconds
}
