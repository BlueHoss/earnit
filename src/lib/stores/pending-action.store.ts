import { writable } from 'svelte/store';

interface PendingAction {
	type: string;
	payload: any;
}

function createPendingActionsStore() {
	const STORAGE_KEY = 'pendingActions';

	// Load initial state from localStorage
	const storedActions =
		typeof localStorage !== 'undefined'
			? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
			: [];

	const { subscribe, set, update } = writable<PendingAction[]>(storedActions);

	// Update localStorage whenever the store changes
	subscribe((actions) => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
		}
	});

	return {
		subscribe,
		addAction: (action: PendingAction) => update((actions) => [...actions, action]),
		clearActions: () => set([]),
		getActions: () => {
			let actions: PendingAction[] = [];
			subscribe((value) => {
				actions = value;
			})();
			return actions;
		}
	};
}

export const pendingActions = createPendingActionsStore();
