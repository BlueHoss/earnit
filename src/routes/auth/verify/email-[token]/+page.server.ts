import { UserService } from '$lib/server/services/user.service.server';
import { sendWelcomeEmail } from '$lib/config/email-messages';
import type { BaseUser } from '$lib/schema/login.schema.js';

export async function load({ params }) {
	try {
		const token = params.token as string;
		const user: BaseUser | null = await UserService.getUserByToken(token);

		if (!user) {
			return {
				heading: 'Email Verification Problem',
				message:
					'Your email could not be verified. Please contact support if you feel this is an error.'
			};
		}

		let heading = 'Email Verification Problem';
		let message =
			'Your email could not be verified. Please contact support if you feel this is an error.';

		if (user) {
			sendWelcomeEmail(user.email);
			heading = 'Email Verified';
			message =
				'Your email has been verified. You can now <a href="/auth/sign-in" class="underline">sign in</a>';
			await UserService.updateUser(user.id, { verified: true });
		}
		return { heading, message };
	} catch (e) {
		return {
			heading: 'Email Verification Problem',
			message:
				'Your email could not be verified. Please contact support if you feel this is an error.'
		};
	}
}
