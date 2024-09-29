import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { ImageService } from '$lib/server/services/image.service.server';
import { LoggerService } from '$lib/server/services/logger.service.server';

export async function POST({ request }: RequestEvent) {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const uploadType = formData.get('uploadType') as string;

	try {
		LoggerService.info('Uploading profile image');
		const url = await ImageService.uploadProfileImage(file, uploadType);
		return json({ url });
	} catch (error) {
		LoggerService.handleError(error, 'Error uploading profile image');
		return json({ url: '' });
	}
}
