import { z } from 'zod';

export const userSchema = z.object({
	firstName: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	lastName: z
		.string({ required_error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'], { required_error: 'You must have a role' })
		.default('USER'),
	verified: z.boolean().default(false),
	isCreator: z.boolean().default(false),
	isFollower: z.boolean().default(false),
	terms: z
		.literal<boolean>(true, {
			errorMap: () => ({ message: 'You must accept the terms & privacy policy' })
		})
		.default(false as true),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(true),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	roleError: z.string().optional() //Used for custom error messages
});

export type UserSchema = typeof userSchema;

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

//export type SignInSchema = z.infer<typeof signInSchema>;
export type SignInSchema = typeof signInSchema;

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});

export type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

export const userProfile = z.object({
	first_name: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	last_name: z
		.string({ required_error: 'Last Name required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	handle: z
		.string({ required_error: 'Handle is required' })
		.min(1, { message: 'Handle is required' })
		.max(50, { message: 'Handle must be less than 50 characters' })
		.trim(),
	title: z
		.string()
		.max(100, { message: 'Title must be less than 100 characters' })
		.trim()
		.nullable(),
	tag_line: z
		.string()
		.max(500, {
			message: 'Tag Line must be less than 500 characters. Consider using the bio field.'
		})
		.trim()
		.nullable(),
	social_media_profile: z
		.string()
		.max(100, { message: 'Social Media Profile must be less than 100 characters' })
		.trim()
		.nullable(),
	bio: z.string().trim().nullable(),
	profile_pic: z.string().nullable(),
	receive_email: z.boolean().default(true)
});

export type UserProfile = typeof userProfile;
