import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/auth/sign-in');
	} else {
		if (locals.user.is_creator) {
			redirect(302, '/creator');
		}

		if (locals.user.is_follower) {
			redirect(302, '/follower');
		}
	}
};
