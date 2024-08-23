<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<ModeWatcher />
<main class="w-full lg:grid">
	<div class="flex items-center justify-center">
		<slot></slot>
	</div>
</main>
