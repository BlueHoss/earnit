import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { signInSchema } from '$lib/config/zod-schemas';

const schema = z.object({
	name: z.string().default('Hello world!'),
	email: z.string().email()
});

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(zod(schema));

	// Always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(signInSchema));
		console.log('POST', form);

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
