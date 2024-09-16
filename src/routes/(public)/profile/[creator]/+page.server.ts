import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	//	if (params.creator == 'brett') {
	return {
		name: `${params.creator}`,
		title: '100k',
		tagline: "Funding your wife's habits",
		bio: 'This is a bio'
	};
	//	}

	error(404, 'Not found');
}
