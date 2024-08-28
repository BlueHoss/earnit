import { z } from 'zod';

/**
 * Base User Schema for the Login table
 **/
export const baseLoginSchema = z.object({
	id: z.number(),
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
	role: z.string().default('USER'),
	verified: z.boolean().default(false),
	is_creator: z.boolean().default(false),
	is_follower: z.boolean().default(false),
	provider: z.string().nullable(),
	provider_id: z.string().nullable(),
	profile_pic: z.string().nullable(),
	social_media_profile: z.string().optional(),
	follower_count: z.number().default(0),
	title: z.string().nullable(),
	tag_line: z.string().nullable(),
	bio: z.string().nullable(),
	// terms: z
	// 	.literal<boolean>(true, {
	// 		errorMap: () => ({ message: 'You must accept the terms & privacy policy' })
	// 	})
	// 	.default(false as true),
	terms: z
		.boolean({
			required_error: 'You must accept the terms & privacy policy',
			invalid_type_error: 'Terms must be a yes or no value'
		})
		.refine((val) => val === true, {
			message: 'You must accept the terms & privacy policy'
		}),
	//terms: z.boolean().default(false),
	token: z.string(),
	receive_email: z.boolean().default(true),
	date_created: z.date().optional(),
	date_updated: z.date().optional(),
	roleError: z.string().optional() //Used for custom error messages
});

/**
 * Type for base user schema (login table)
 */
export const baseUserModifedSchema = baseLoginSchema.omit({ roleError: true });
export type BaseUser = z.infer<typeof baseUserModifedSchema>;

export const updateBaseUserSchema = baseLoginSchema.partial().omit({ roleError: true });
export type BaseUserUpdate = z.infer<typeof updateBaseUserSchema>;

/**
 * Schema for new sign ups
 */
export const signupSchema = baseLoginSchema
	.omit({ handle: true, hashed_password: true, token: true })
	.extend({
		password: z.string().min(6, 'Confirm Password is required'),
		confirmPassword: z.string().min(6, 'Confirm Password is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

/**
 * Type for sign up object
 */
export type SignupUser = z.infer<typeof signupSchema>;

/**
 * Schema for user profile edit (including handle)
 */
export const profileEditSchema = baseLoginSchema.omit({
	hashed_password: true,
	terms: true,
	role: true,
	verified: true,
	is_creator: true,
	is_follower: true,
	token: true,
	date_created: true,
	date_updated: true,
	follower_count: true,
	roleError: true
});

/**
 * Profile Edit Object
 */
export type ProfileEditUser = z.infer<typeof profileEditSchema>;

/**
 * Password Update request Schema
 */
export const passworUpdateRequestSchema = baseLoginSchema.pick({ email: true });
export type PasswordUpdateRequest = z.infer<typeof passworUpdateRequestSchema>;

/**
 * Password Update Schema
 */
export const passworUpdateSchema = z
	.object({
		password: z.string().min(6, 'Confirm Password is required'),
		confirmPassword: z.string().min(6, 'Confirm Password is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type PasswordUpdate = z.infer<typeof passworUpdateSchema>;

/**
 * Fetch Followers/Creators schema
 *
 */
export const loginQueryResultSchema = baseLoginSchema.partial();
export type LoginQueryResult = z.infer<typeof loginQueryResultSchema>;
