import {
	pgTable,
	pgEnum,
	serial,
	text,
	boolean,
	timestamp,
	integer,
	numeric,
	primaryKey
} from 'drizzle-orm/pg-core';

export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const code_challenge_method = pgEnum('code_challenge_method', ['s256', 'plain']);
export const factor_status = pgEnum('factor_status', ['unverified', 'verified']);
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn', 'phone']);
export const one_time_token_type = pgEnum('one_time_token_type', [
	'confirmation_token',
	'reauthentication_token',
	'recovery_token',
	'email_change_token_new',
	'email_change_token_current',
	'phone_change_token'
]);
export const key_status = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const key_type = pgEnum('key_type', [
	'aead-ietf',
	'aead-det',
	'hmacsha512',
	'hmacsha256',
	'auth',
	'shorthash',
	'generichash',
	'kdf',
	'secretbox',
	'secretstream',
	'stream_xchacha20'
]);
export const action = pgEnum('action', ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR']);
export const equality_op = pgEnum('equality_op', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in']);

export const login_table = pgTable('login', {
	id: serial('id').primaryKey().notNull(),
	handle: text('handle').notNull(),
	email: text('email').notNull().unique(),
	first_name: text('first_name').notNull(),
	last_name: text('last_name').notNull(),
	token: text('token').notNull().unique(),
	verified: boolean('verified').notNull().default(false),
	receive_email: boolean('receive_email').notNull().default(true),
	hashed_password: text('hashed_password').notNull(),
	date_created: timestamp('date_created').defaultNow().notNull(),
	date_updated: timestamp('date_updated').defaultNow().notNull(),
	provider_id: text('provider_id'),
	provider: text('provider'),
	profile_pic: text('profile_pic'),
	social_media_profile: text('social_media_profile').notNull(),
	role: text('role').notNull().default('USER'),
	is_follower: boolean('is_follower').notNull().default(false),
	is_creator: boolean('is_creator').notNull().default(false),
	follower_count: integer('follower_count').notNull().default(0),
	title: text('title'),
	tag_line: text('tag_line'),
	bio: text('bio')
});

export type User = typeof login_table.$inferInsert;
export type UpdateUser = Partial<typeof login_table.$inferInsert>;
export type Session = typeof auth_session_table.$inferInsert;

export const auth_session_table = pgTable('auth_session', {
	id: text('id').primaryKey(), // Auto-incrementing primary key
	userId: integer('user_id')
		.notNull()
		.references(() => login_table.id), // User ID associated with the session
	expiresAt: timestamp('expires_at').notNull(), // Expiration time of the session
	token: text('token').notNull() // Session token
});

export const reward_ledger_table = pgTable('reward_ledger', {
	id: serial('id').primaryKey().notNull(),
	date_earned: timestamp('date_earned', { mode: 'string' }),
	amount: numeric('amount'),
	creator_id: integer('creator_id').references(() => login_table.id)
});

export const product_table = pgTable('product', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	description: text('description'),
	store_id: integer('store_id').references(() => store_table.id),
	cover_image: text('cover_image'),
	cost: numeric('cost', { precision: 10, scale: 2 }).notNull().default('0.00')
});

export const product_invoice_table = pgTable('product_invoice', {
	id: serial('id').primaryKey().notNull(),
	product_id: integer('product_id').references(() => product_table.id),
	cost: numeric('cost', { precision: 10, scale: 2 }).notNull().default('0.00'),
	date_purchased: timestamp('date_purchased', { mode: 'date' }),
	creator_user_id: integer('creator_user_id').references(() => login_table.id),
	follower_user_id: integer('follower_user_id').references(() => login_table.id)
});

export const plan_table = pgTable('plan', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	plan_percent: numeric('plan_percent').notNull(),
	cost: numeric('plan_cost').notNull()
});

export const store_table = pgTable('store', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	creator_user_id: integer('creator_user_id')
});

export const mission_table = pgTable('mission', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	platform: text('platform')
});

export const plan_subscription_table = pgTable('plan_subscription', {
	id: serial('id').primaryKey().notNull(),
	creator_user_id: integer('creator_user_id').references(() => login_table.id),
	follower_user_id: integer('follower_user_id').references(() => login_table.id),
	date_started: timestamp('date_started', { mode: 'string' }),
	plan_id: integer('plan_id').references(() => plan_table.id),
	date_canceled: timestamp('date_canceled', { mode: 'string' }),
	active: boolean('active')
});

export const product_item_table = pgTable('product_item', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	download_url: text('download_url'),
	product_id: integer('product_id').references(() => product_table.id),
	buyitnow_link: text('buyitnow_link')
});

export const reward_action_table = pgTable('reward_action', {
	id: serial('id').primaryKey().notNull(),
	mission_id: integer('mission_id').references(() => mission_table.id),
	name: text('name'),
	reward_per_day: numeric('reward_per_day'),
	creator_user_id: integer('creator_user_id').references(() => login_table.id)
});

export const reward_earned_table = pgTable('reward_earned', {
	id: serial('id').primaryKey().notNull(),
	follower_user_id: integer('follower_user_id').references(() => login_table.id),
	date_awarded: timestamp('date_awarded', { mode: 'date' }),
	reward_type_id: integer('reward_type_id').references(() => reward_action_table.id),
	reward_value: numeric('reward_value'),
	creator_user_id: integer('creator_user_id').references(() => login_table.id)
});

export const follower_creator_table = pgTable(
	'follower_creator',
	{
		follower_user_id: integer('follower_user_id')
			.notNull()
			.references(() => login_table.id),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login_table.id)
	},
	(table) => {
		return {
			follower_creator_pkey: primaryKey({
				columns: [table.follower_user_id, table.creator_user_id],
				name: 'follower_creator_pkey'
			})
		};
	}
);
