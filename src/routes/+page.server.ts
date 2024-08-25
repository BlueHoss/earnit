export const load = async ({ locals }) => {
	if (!locals.user) {
		return {
			status: 401,
			redirect: '/auth/sign-in'
		};
	}
};
