// import { redirect } from '@sveltejs/kit';
// import { getUserRole } from '$lib/utils/auth';
// import type { LayoutLoad } from './$types';

// export const load: LayoutLoad = async ({ url }) => {
// 	const role = getUserRole();

// 	if (!role && url.pathname !== '/login') {
// 		throw redirect(302, '/auth/login');
// 	}

// 	if (role === 'follower' && url.pathname !== '/follower') {
// 		throw redirect(302, '/follower');
// 	}

// 	if (role === 'creator' && url.pathname !== '/creator') {
// 		throw redirect(302, '/creator');
// 	}

// 	if (role === 'both' && url.pathname !== '/') {
// 		throw redirect(302, '/');
// 	}
// };
