<script lang="ts">
	import moment from 'moment';

	export let date: Date | string;
	export let format: 'long' | 'short' | 'fromNow' = 'short';

	function formatDate(inputDate: Date | string): string {
		if (format === 'fromNow') {
			return moment(inputDate).fromNow();
		} else if (format === 'short') {
			return moment(inputDate).format('MMM D, YYYY');
		} else {
			return moment(inputDate).format('h:mm A - MMM D, YYYY');
		}
	}
</script>

<span>{formatDate(date)}</span>
