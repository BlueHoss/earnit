import {
	pgTable,
	unique,
	pgEnum,
	serial,
	text,
	boolean,
	timestamp,
	index,
	foreignKey,
	integer,
	numeric,
	primaryKey
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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

export const authUserTable = pgTable('auth_user', {
	id: serial('id').primaryKey().notNull(),
	username: text('username').notNull(),
	email: text('email').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name'),
	token: text('token').unique(),
	verified: boolean('verified').notNull().default(false),
	receiveEmail: boolean('receive_email').notNull().default(true),
	hashedPassword: text('hashed_password').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	providerId: text('provider_id'),
	provider: text('provider')
});

export const authSessionTable = pgTable('auth_session', {
	id: text('id').primaryKey(), // Auto-incrementing primary key
	userId: text('user_id').notNull(), // User ID associated with the session
	expiresAt: timestamp('expires_at').notNull(), // Expiration time of the session
	token: text('token').notNull() // Session token
});

export const auth_key = pgTable(
	'auth_key',
	{
		id: serial('id').primaryKey().notNull(),
		hashed_password: text('hashed_password'),
		user_id: integer('user_id')
			.notNull()
			.references(() => authUserTable.id, { onDelete: 'cascade' })
	},
	(table) => {
		return {
			idx_auth_key_user_id: index('idx_auth_key_user_id').using('btree', table.user_id)
		};
	}
);

export const reward_ledger = pgTable('reward_ledger', {
	id: serial('id').primaryKey().notNull(),
	date_earned: timestamp('date_earned', { mode: 'string' }),
	amount: numeric('amount'),
	creator_id: integer('creator_id').references(() => login.id)
});

export const login = pgTable('login', {
	id: serial('id').primaryKey().notNull(),
	username: text('username'),
	email: text('email'),
	first_name: text('first_name'),
	last_name: text('last_name'),
	profile_pic: text('profile_pic'),
	social_media_profile: text('social_media_profile'),
	role_id: integer('role_id'),
	is_follower: boolean('is_follower'),
	is_creator: boolean('is_creator')
});

export const product = pgTable('product', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	description: text('description'),
	store_id: integer('store_id').references(() => store.id),
	cover_image: text('cover_image'),
	cost: numeric('cost')
});

export const invoice = pgTable('invoice', {
	id: serial('id').primaryKey().notNull(),
	product_id: integer('product_id').references(() => product.id),
	cost: numeric('cost'),
	date_purchased: timestamp('date_purchased', { mode: 'string' }),
	login_id: integer('login_id').references(() => login.id)
});

export const plan = pgTable('plan', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	plan_percent: numeric('plan_percent')
});

export const store = pgTable('store', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	creator_user_id: integer('creator_user_id')
});

export const mission = pgTable('mission', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	platform: text('platform')
});

export const plan_subscription = pgTable('plan_subscription', {
	id: serial('id').primaryKey().notNull(),
	creator_user_id: integer('creator_user_id').references(() => login.id),
	follower_user_id: integer('follower_user_id').references(() => login.id),
	date_started: timestamp('date_started', { mode: 'string' }),
	plan_id: integer('plan_id').references(() => plan.id),
	date_canceled: timestamp('date_canceled', { mode: 'string' }),
	active: boolean('active')
});

export const product_item = pgTable('product_item', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	download_url: text('download_url'),
	product_id: integer('product_id').references(() => product.id),
	buyitnow_link: text('buyitnow_link')
});

export const reward_action = pgTable('reward_action', {
	id: serial('id').primaryKey().notNull(),
	mission_id: integer('mission_id').references(() => mission.id),
	name: text('name'),
	reward_per_day: numeric('reward_per_day'),
	creator_user_id: integer('creator_user_id').references(() => login.id)
});

export const reward_earned = pgTable('reward_earned', {
	id: serial('id').primaryKey().notNull(),
	follower_user_id: integer('follower_user_id').references(() => login.id),
	date_awarded: timestamp('date_awarded', { mode: 'string' }),
	reward_type_id: integer('reward_type_id').references(() => reward_action.id),
	reward_value: numeric('reward_value'),
	creator_user_id: integer('creator_user_id').references(() => login.id),
	action_id: integer('action_id').references(() => reward_action.id)
});

export const follower_creator = pgTable(
	'follower_creator',
	{
		follower_user_id: integer('follower_user_id')
			.notNull()
			.references(() => login.id),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login.id)
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
