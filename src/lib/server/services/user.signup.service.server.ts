import { TextUtilities } from '$lib/utils/text-utilities.js';
import { type BaseUser, type SignupUser } from '$lib/schema/login.schema';
import type { User } from '$lib/server/database/schema';
import { Argon2id } from 'oslo/password';
import { createUser } from '../database/user-model';

async function createNewUser(signupSchema: SignupUser): Promise<User | null> {
	const newUser = await transformSignupToUser(signupSchema);
	return await createUser(newUser);
}

// Utility function to transform signup data to full user data
async function transformSignupToUser(signupData: SignupUser): Promise<BaseUser> {
	const { ...userData } = signupData;
	return {
		...userData,
		handle: createHandle(signupData.first_name, signupData.last_name),
		hashed_password: await new Argon2id().hash(signupData.password),
		title: "Earn It's Newest User",
		profile_pic:
			'https://bbudfdepnozxvkdmrunu.supabase.co/storage/v1/object/public/profile_new/defaultuser.png?t=2024-08-26T20%3A09%3A09.778Z',
		tag_line: 'Selling digital products is my jam!',
		bio: 'Say hi. I am new here!',
		token: crypto.randomUUID(),
		date_created: new Date(),
		date_updated: new Date()
	};
}

// Function to create a handle from first and last name
function createHandle(firstName: string, lastName: string): string {
	return TextUtilities.removeAllSpaces(`${firstName.toLowerCase()}${lastName.toLowerCase()}`);
}

export const UserSignUpService = {
	createNewUser
};
