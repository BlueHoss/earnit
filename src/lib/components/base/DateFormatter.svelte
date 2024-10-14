<script lang="ts">
	import moment from 'moment';
	import { dateProxy } from 'sveltekit-superforms';

	export let date: Date | string;
	export let epoch: number = 0;
	export let format: 'long' | 'short' | 'fromNow' | 'toNow' = 'short';

	function formatDate(inputDate: Date | string): string {
		if (epoch > 0) {
			inputDate = new Date(epoch * 1000);
		}
		if (format === 'fromNow') {
			return moment(inputDate).fromNow();
		}
		if (format === 'toNow') {
			var today = new Date();
			let diff = moment(inputDate).toDate().getTime() - today.getTime();
			return `${Math.round(diff / (1000 * 3600 * 24))} days`;
		} else if (format === 'short') {
			return moment(inputDate).format('MMM D, YY');
		} else {
			return moment(inputDate).format('h:mm A - MMM D, YYYY');
		}
	}
</script>

<span>{formatDate(date)}</span>
