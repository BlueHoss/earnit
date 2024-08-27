import { z } from 'zod';

export const baseUserSchema = z.object({
	handle: z
		.string({ required_error: 'Handle is required' })
		.min(1, { message: 'Handle is required' })
		.max(50)
		.trim(),
	first_name: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.max(50, { message: 'First Name must be less than 50 characters' })
		.trim(),
	last_name: z
		.string({ required_error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	hashed_password: z.string(),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'], { required_error: 'You must have a role' })
		.default('USER'),
	verified: z.boolean().default(false),
	is_creator: z.boolean().default(false),
	is_follower: z.boolean().default(false),
	provider: z.string().optional(),
	provider_id: z.string().optional(),
	profile_pic: z.string().optional(),
	social_media_profile: z.string().optional(),
	follower_count: z.number().default(0),
	title: z.string().optional(),
	tag_line: z.string().optional(),
	bio: z.string().optional(),
	terms: z
		.literal<boolean>(true, {
			errorMap: () => ({ message: 'You must accept the terms & privacy policy' })
		})
		.default(false as true),
	token: z.string(),
	receive_email: z.boolean().default(true),
	date_created: z.date().optional(),
	date_updated: z.date().optional(),
	roleError: z.string().optional() //Used for custom error messages
});

// Schema for user signup (without handle)
export const signupSchema = baseUserSchema
	.omit({ handle: true, hashed_password: true, token: true })
	.extend({
		password: z.string().min(6, 'Confirm Password is required'),
		confirmPassword: z.string().min(6, 'Confirm Password is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

// Type for the base user schema
export type BaseUser = z.infer<typeof baseUserSchema>;

export type SignupUser = z.infer<typeof signupSchema>;

// Schema for user profile edit (including handle)
export const profileEditSchema = baseUserSchema.omit({ hashed_password: true, terms: true });

// Type for profile edit schema
export type ProfileEditUser = z.infer<typeof profileEditSchema>;
