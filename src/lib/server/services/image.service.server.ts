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
import { supabaseServerClient } from './supabase.service.server';

// Variables
import {
	PUBLIC_SUPABASE_STORAGE_URL,
	PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET,
	PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET
} from '$env/static/public';
import { LoggerService } from './logger.service.server';

/**
 * Given a File type it checks the suffix to ensure it's a valid image type.
 *
 * @param supabase
 * @param userId
 * @param profileImageUrl
 * @returns
 */
async function uploadProfileImage(file: File, uploadType: string): Promise<string | undefined> {
	const suffix = getImageSuffix(file.type);
	LoggerService.info(
		`Uploading profile image to to bucket: ${uploadType} of type: ${file.type} with suffix: ${suffix}`
	);

	if (suffix) {
		switch (uploadType) {
			case 'profile_image':
				LoggerService.info(
					'Uploading profile image of type: ' + file.type + ' to profile_image bucket'
				);
				return await addToBucket(file, suffix, PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET);
			case 'product_image':
				LoggerService.info(
					'Uploading profile image of type: ' + file.type + ' to product_image bucket'
				);
				return await addToBucket(file, suffix, PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET);
		}
	}
}

/**
 * Uploads the image to the bucket defined by the given env variable.
 *
 * @param supabase
 * @param imageBlob
 */
async function addToBucket(
	imageBlob: Blob,
	suffix: string,
	bucket: string
): Promise<string | undefined> {
	const buffer = await imageBlob.arrayBuffer();
	const imageBuffer = Buffer.from(buffer);
	const imageName = uuidv4() + suffix;
	const { data, error } = await supabaseServerClient.storage
		.from(bucket)
		.upload(imageName, imageBuffer, {
			contentType: imageBlob.type,
			upsert: true
		});

	if (data) {
		LoggerService.info(`Image uploaded to ${bucket} successfully`);
		return PUBLIC_SUPABASE_STORAGE_URL + '/' + data.fullPath;
	} else {
		LoggerService.error(`Error uploading image to ${bucket}`, '', 'image.service.server.ts');
		console.error('Error uploading the image:', error);
		return '';
	}
}

async function deleteProfileImage(fileUrl: string, uploadType: string) {
	let bucket = PUBLIC_SUPABASE_PROFILE_IMAGE_BUCKET;

	if (uploadType === 'product_image') {
		bucket = PUBLIC_SUPABASE_PRODUCT_IMAGE_BUCKET;
	}

	const { error } = await supabaseServerClient.storage.from(bucket).remove([`${fileUrl}`]);

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
		case 'image/gif':
			return '.gif';
		case 'image/svg+xml':
			return '.svg';
		case 'application/pdf':
			return '.pdf';
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return '.docx';
		case 'text/html':
			return '.html';
	}
}

export const ImageService = {
	uploadProfileImage,
	deleteProfileImage
};
