import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	//	if (params.creator == 'brett') {
	return {
		name: `${params.creator}`,
		followers: '100k',
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
	//	}

	error(404, 'Not found');
}
