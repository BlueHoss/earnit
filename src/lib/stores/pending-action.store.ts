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

	return {
		subscribe,
		addAction: (action: PendingAction) => {
			update((actions) => {
				// Check if an action of the same type and with the same payload already exists
				const actionExists = actions.some(
					(existingAction) =>
						existingAction.type === action.type &&
						JSON.stringify(existingAction.payload) === JSON.stringify(action.payload)
				);

				// Only add the action if it doesn't already exist
				if (!actionExists) {
					return [...actions, action];
				}
				return actions;
			});
		},
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
