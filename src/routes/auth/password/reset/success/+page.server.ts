export const load = async ({ url }) => {
	const email = url.searchParams.get('email');
	return {
		email
	};
};
