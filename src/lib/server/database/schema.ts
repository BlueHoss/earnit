import {
	pgTable,
	pgEnum,
	serial,
	text,
	boolean,
	timestamp,
	integer,
	numeric,
	primaryKey,
	uniqueIndex
} from 'drizzle-orm/pg-core';

import { TextUtilities } from '../../utils/text-utilities';
import { sql } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';

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

export const login_table = pgTable(
	'login',
	{
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
		terms: boolean('terms').notNull().default(false),
		social_media_profile: text('social_media_profile'),
		role: text('role').notNull().default('USER'),
		is_follower: boolean('is_follower').notNull().default(false),
		is_creator: boolean('is_creator').notNull().default(false),
		follower_count: integer('follower_count').notNull().default(0),
		title: text('title'),
		tag_line: text('tag_line'),
		bio: text('bio'),
		reward_name: text('reward_name'),
		store_name: text('store_name'),
		category: text('category')
	},
	(table) => ({
		emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(TextUtilities.lower(table.email))
	})
);

export type User = typeof login_table.$inferInsert;
export type UpdateUser = Partial<typeof login_table.$inferInsert>;
export type Session = typeof auth_session_table.$inferInsert;

export const auth_session_table = pgTable('auth_session', {
	id: text('id').primaryKey(), // Auto-incrementing primary key
	userId: integer('user_id')
		.notNull()
		.references(() => login_table.id, { onDelete: 'cascade' }), // User ID associated with the session
	expiresAt: timestamp('expires_at').notNull(), // Expiration time of the session
	token: text('token').notNull() // Session token
});

export const product_table = pgTable('product', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	description: text('description'),
	creator_user_id: integer('creator_user_id')
		.notNull()
		.references(() => login_table.id, { onDelete: 'cascade' }),
	cover_image: text('cover_image'),
	cost: numeric('cost', { precision: 10, scale: 2 }).notNull().default('0.00'),
	buyitnow_link: text('buyitnow_link'),
	enabled: boolean('enabled').notNull().default(true)
});

export const product_item_table = pgTable('product_item', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	file_name: text('file_name'),
	download_url: text('download_url'),
	product_id: integer('product_id')
		.notNull()
		.references(() => product_table.id, { onDelete: 'cascade' })
});

export const product_invoice_table = pgTable('product_invoice', {
	id: serial('id').primaryKey().notNull(),
	product_id: integer('product_id').references(() => product_table.id),
	cost: numeric('cost', { precision: 10, scale: 2 }).notNull().default('0.00'),
	date_purchased: timestamp('date_purchased', { mode: 'date' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	//date_purchased: timestamp('date_purchased', { mode: 'date' }),
	creator_user_id: integer('creator_user_id').references(() => login_table.id),
	follower_user_id: integer('follower_user_id').references(() => login_table.id, {
		onDelete: 'cascade'
	})
});

export const plan_table = pgTable('plan', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	description: text('description'),
	plan_percent: numeric('plan_percent').notNull(),
	plan_cost: numeric('plan_cost').notNull()
});

export const mission_table = pgTable('mission', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	description: text('description'),
	platform: text('platform')
});

export const mission_action_table = pgTable('mission_action', {
	id: serial('id').primaryKey().notNull(),
	mission_id: integer('mission_id')
		.references(() => mission_table.id)
		.notNull(),
	name: text('name').notNull(),
	description: text('description'),
	icon: text('icon'),
	reward_per_day: integer('reward_per_day').notNull().default(0),
	creator_user_id: integer('creator_user_id')
		.references(() => login_table.id, { onDelete: 'cascade' })
		.notNull()
});

export const mission_default_action_table = pgTable('mission_default_action', {
	id: serial('id').primaryKey().notNull(),
	mission_id: integer('mission_id')
		.references(() => mission_table.id)
		.notNull(),
	name: text('name').notNull(),
	description: text('description'),
	icon: text('icon'),
	reward_per_day: integer('reward_per_day').notNull().default(0)
});

export const plan_subscription_table = pgTable('plan_subscription', {
	id: serial('id').primaryKey().notNull(),
	creator_user_id: integer('creator_user_id')
		.references(() => login_table.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	follower_user_id: integer('follower_user_id')
		.references(() => login_table.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	date_started: timestamp('date_started', { mode: 'string' }).notNull(),
	plan_id: integer('plan_id')
		.references(() => plan_table.id)
		.notNull(),
	date_canceled: timestamp('date_canceled', { mode: 'string' })
});

export const mission_creator_table = pgTable(
	'mission_creator',
	{
		mission_id: integer('mission_id')
			.notNull()
			.references(() => mission_table.id),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login_table.id, { onDelete: 'cascade' }),
		enabled: boolean('enabled').notNull().default(true)
	},
	(table) => {
		return {
			follower_mission_pkey: primaryKey({
				columns: [table.mission_id, table.creator_user_id],
				name: 'follower_mission_pkey'
			})
		};
	}
);

export const follower_creator_table = pgTable(
	'follower_creator',
	{
		follower_user_id: integer('follower_user_id')
			.notNull()
			.references(() => login_table.id, { onDelete: 'cascade' }),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login_table.id, { onDelete: 'cascade' })
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

/**
 * Tracks the total credits a creator has purchased and how many are available to distribute.
 * The difference between total_credits and available_credits represents credits already distributed to followers.
 */
export const credit_creator_balance_table = pgTable(
	'credit_creator_balance',
	{
		id: serial('id').primaryKey().notNull(),
		creator_user_id: integer('creator_user_id')
			.references(() => login_table.id)
			.notNull(),
		credits_awarded: numeric('credits_awarded', { precision: 10, scale: 2 })
			.notNull()
			.default('0.00'),
		credits_received: numeric('credits_received', { precision: 10, scale: 2 })
			.notNull()
			.default('0.00'),
		credit_balance: numeric('credit_balance', { precision: 10, scale: 2 })
			.notNull()
			.default('0.00'),
		date_updated: timestamp('date_updated').defaultNow().notNull()
	},
	(table) => {
		return {
			nameIdx: index('idx_credit_creator_balance_creator_id').on(table.creator_user_id)
		};
	}
);

/**
 * Maintains a separate balance for each follower-creator relationship.
 * Allows followers to have different credit balances for different creators they follow.
 */
export const credit_follower_balance_table = pgTable(
	'credit_follower_balance',
	{
		id: serial('id').primaryKey().notNull(),
		follower_user_id: integer('follower_user_id')
			.references(() => login_table.id, { onDelete: 'cascade' })
			.notNull(),
		creator_user_id: integer('creator_user_id')
			.references(() => login_table.id)
			.notNull(),
		credit_balance: numeric('credit_balance', { precision: 10, scale: 2 })
			.notNull()
			.default('0.00')
			.notNull(),
		date_updated: timestamp('date_updated').defaultNow().notNull()
	},
	(table) => ({
		followerIdIdx: index('idx_credit_follower_balance_follower_id').on(table.follower_user_id),
		creatorIdIdx: index('idx_credit_follower_balance_creator_id').on(table.creator_user_id)
	})
);

/**
 * Logs all credit-related activities for auditing and history purposes.
 * The transaction_type field distinguishes between different types of transactions (e.g., purchases, distributions, redemptions).
 */
export const credit_transaction_table = pgTable(
	'credit_transaction',
	{
		id: serial('id').primaryKey().notNull(),
		transaction_type: text('transaction_type'),
		description: text('description'),
		follower_user_id: integer('follower_user_id')
			.references(() => login_table.id, { onDelete: 'cascade' })
			.notNull(),
		creator_user_id: integer('creator_user_id')
			.references(() => login_table.id, { onDelete: 'cascade' })
			.notNull(),
		amount: numeric('amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
		date_transaction: timestamp('date_transaction').defaultNow().notNull()
	},
	(table) => ({
		creatorIdIdx: index('idx_credit_transactions_creator_id').on(table.creator_user_id),
		followerIdIdx: index('idx_credit_transactions_follower_id').on(table.follower_user_id)
	})
);

/**
 * this table tracks all of the distributions from Earn It to the creators
 */
export const credit_distribution_table = pgTable('credit_distribution', {
	id: serial('id').primaryKey().notNull(),
	earnit_creator_user_id: integer('earnit_creator_user_id')
		.references(() => login_table.id)
		.notNull(),
	creator_user_id: integer('creator_user_id')
		.references(() => login_table.id)
		.notNull(),
	amount: numeric('amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
	date_transaction: timestamp('date_transaction').defaultNow().notNull()
});
