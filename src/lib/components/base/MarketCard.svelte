<script lang="ts">
	export let storeName;
	export let storeTitle;
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<a href="/market/{storeName}" class="block">
	<div
		class="flex items-center space-x-4 rounded-lg bg-secondary p-4 shadow-md transition duration-300 hover:bg-muted"
	>
		<img src="/img/suzy.webp" alt={storeName} class="h-16 w-16 rounded-md object-cover" />
		<div>
			<h3 class="text-lg font-semibold">{storeName}'s Store</h3>
			<p class="text-sm text-gray-400">{storeTitle} Group &middot; 2.5k</p>
		</div>
	</div>
</a>
