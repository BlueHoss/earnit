/**
 * Image service
 *
 * Used for uploading images (png, jpg, tiff, webp), though could be easily modifed to
 * allow for uploading any type of file by changing the "getSuffix" function.
 *
 * Changes given image name into a uuid to ensure no overlapping names.
 *
 */

// Libraries and modules
import { v4 as uuidv4 } from 'uuid';
import { supabaseServerClient } from './supabase.service';

// Variables
import { PRIVATE_SUPABASE_PROFILE_IMAGE_BUCKET } from '$env/static/private';
import { PUBLIC_SUPABASE_STORAGE_URL } from '$env/static/public';

/**
 * Given a File type it checks the suffix to ensure it's a valid image type.
 *
 * @param supabase
 * @param userId
 * @param profileImageUrl
 * @returns
 */
async function uploadProfileImage(file: File): Promise<string | undefined> {
	const suffix = getImageSuffix(file.type);
	if (suffix) {
		return await addToBucket(file, suffix);
	}
}

/**
 * Uploads the image to the bucket defined by the given env variable.
 *
 * @param supabase
 * @param imageBlob
 */
async function addToBucket(imageBlob: Blob, suffix: string): Promise<string | undefined> {
	const buffer = await imageBlob.arrayBuffer();
	const imageBuffer = Buffer.from(buffer);
	const imageName = uuidv4() + suffix;
	const { data, error } = await supabaseServerClient.storage
		.from(PRIVATE_SUPABASE_PROFILE_IMAGE_BUCKET)
		.upload(imageName, imageBuffer, {
			contentType: imageBlob.type,
			upsert: true
		});

	if (data) {
		return PUBLIC_SUPABASE_STORAGE_URL + '/' + data.fullPath;
	} else {
		console.error('Error uploading the image:', error);
		return '';
	}
}

export async function deleteProfileImage(fileUrl: string) {
	const { error } = await supabaseServerClient.storage
		.from(PRIVATE_SUPABASE_PROFILE_IMAGE_BUCKET)
		.remove([`${fileUrl}`]);

	if (error) {
		console.error('Error deleting file:', error);
		throw new Error('File deleted successfully');
	} else {
		console.log('File deleted successfully');
	}
}

/**
 * Checks suffix and returns undefined if not valid;
 *
 * @param mimeType
 * @returns
 */
function getImageSuffix(mimeType: string): string | undefined {
	switch (mimeType) {
		case 'image/png':
			return '.png';
		case 'image/jpeg':
			return '.jpg';
		case 'image/tiff':
			return '.tiff';
		case 'image/webp':
			return '.webp';
	}
}

export const ImageService = {
	uploadProfileImage
};
