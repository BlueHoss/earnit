import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { signInSchema } from '$lib/config/zod-schemas';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(signInSchema))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(signInSchema));
		console.log('POST', form);

		console.log('Valid form:', form.data.email);

		if (!form.valid) {
			return { form };
		}

		// TODO: Do something with the validated data

		// Redirect if you want
		// throw redirect(303, '/');

		// Or return { form } to stay on the page
		return { form };
	}
};
