import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { ImageService } from '$lib/server/services/image.service.server';

export async function POST({ request }: RequestEvent) {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const uploadType = formData.get('uploadType') as string;

	try {
		const url = await ImageService.uploadProfileImage(file, uploadType);
		return json({ url });
	} catch (error) {
		return json({ error }, { status: 400 });
	}
}
