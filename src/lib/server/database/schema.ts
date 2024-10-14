import {
	pgTable,
	pgEnum,
	serial,
	integer,
	text,
	index,
	numeric,
	timestamp,
	bigint,
	varchar,
	unique,
	boolean,
	smallint,
	uniqueIndex,
	primaryKey
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const code_challenge_method = pgEnum('code_challenge_method', ['s256', 'plain']);
export const factor_status = pgEnum('factor_status', ['unverified', 'verified']);
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn', 'phone']);
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
export const one_time_token_type = pgEnum('one_time_token_type', [
	'confirmation_token',
	'reauthentication_token',
	'recovery_token',
	'email_change_token_new',
	'email_change_token_current',
	'phone_change_token'
]);
export const action = pgEnum('action', ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR']);
export const equality_op = pgEnum('equality_op', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in']);

export const mission_default_action = pgTable('mission_default_action', {
	id: serial('id').primaryKey().notNull(),
	mission_id: integer('mission_id')
		.notNull()
		.references(() => mission.id),
	name: text('name').notNull(),
	reward_per_day: integer('reward_per_day').default(0).notNull(),
	description: text('description'),
	icon: text('icon')
});

export const credit_transaction = pgTable(
	'credit_transaction',
	{
		id: serial('id').primaryKey().notNull(),
		transaction_type: text('transaction_type'),
		description: text('description'),
		follower_user_id: integer('follower_user_id')
			.notNull()
			.references(() => login.id, { onDelete: 'cascade' }),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login.id, { onDelete: 'cascade' }),
		amount: numeric('amount', { precision: 10, scale: 2 }).default('0.00').notNull(),
		date_transaction: timestamp('date_transaction', { mode: 'string' }).defaultNow().notNull()
	},
	(table) => {
		return {
			idx_credit_transactions_creator_id: index('idx_credit_transactions_creator_id').using(
				'btree',
				table.creator_user_id
			),
			idx_credit_transactions_follower_id: index('idx_credit_transactions_follower_id').using(
				'btree',
				table.follower_user_id
			)
		};
	}
);

export const credit_follower_balance = pgTable(
	'credit_follower_balance',
	{
		id: serial('id').primaryKey().notNull(),
		follower_user_id: integer('follower_user_id')
			.notNull()
			.references(() => login.id, { onDelete: 'cascade' }),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login.id),
		credit_balance: numeric('credit_balance', { precision: 10, scale: 2 })
			.default('0.00')
			.notNull(),
		date_updated: timestamp('date_updated', { mode: 'string' }).defaultNow().notNull()
	},
	(table) => {
		return {
			idx_credit_follower_balance_creator_id: index('idx_credit_follower_balance_creator_id').using(
				'btree',
				table.creator_user_id
			),
			idx_credit_follower_balance_follower_id: index(
				'idx_credit_follower_balance_follower_id'
			).using('btree', table.follower_user_id)
		};
	}
);

export const credit_creator_balance = pgTable(
	'credit_creator_balance',
	{
		id: serial('id').primaryKey().notNull(),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login.id),
		credits_awarded: numeric('credits_awarded', { precision: 10, scale: 2 })
			.default('0.00')
			.notNull(),
		credits_received: numeric('credits_received', { precision: 10, scale: 2 })
			.default('0.00')
			.notNull(),
		date_updated: timestamp('date_updated', { mode: 'string' }).defaultNow().notNull(),
		credit_balance: numeric('credit_balance')
	},
	(table) => {
		return {
			idx_credit_creator_balance_creator_id: index('idx_credit_creator_balance_creator_id').using(
				'btree',
				table.creator_user_id
			)
		};
	}
);

export const credit_distribution = pgTable('credit_distribution', {
	id: serial('id').primaryKey().notNull(),
	earnit_creator_user_id: integer('earnit_creator_user_id')
		.notNull()
		.references(() => login.id),
	creator_user_id: integer('creator_user_id')
		.notNull()
		.references(() => login.id),
	amount: numeric('amount', { precision: 10, scale: 2 }).default('0.00').notNull(),
	date_transaction: timestamp('date_transaction', { mode: 'string' }).defaultNow().notNull()
});

export const django_migrations = pgTable('django_migrations', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	app: varchar('app', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	applied: timestamp('applied', { withTimezone: true, mode: 'string' }).notNull()
});

export const django_content_type = pgTable(
	'django_content_type',
	{
		id: integer('id').primaryKey().notNull(),
		app_label: varchar('app_label', { length: 100 }).notNull(),
		model: varchar('model', { length: 100 }).notNull()
	},
	(table) => {
		return {
			django_content_type_app_label_model_76bd3d3b_uniq: unique(
				'django_content_type_app_label_model_76bd3d3b_uniq'
			).on(table.app_label, table.model)
		};
	}
);

export const auth_permission = pgTable(
	'auth_permission',
	{
		id: integer('id').primaryKey().notNull(),
		name: varchar('name', { length: 255 }).notNull(),
		content_type_id: integer('content_type_id')
			.notNull()
			.references(() => django_content_type.id),
		codename: varchar('codename', { length: 100 }).notNull()
	},
	(table) => {
		return {
			content_type_id_2f476e4b: index('auth_permission_content_type_id_2f476e4b').using(
				'btree',
				table.content_type_id
			),
			auth_permission_content_type_id_codename_01ab375a_uniq: unique(
				'auth_permission_content_type_id_codename_01ab375a_uniq'
			).on(table.content_type_id, table.codename)
		};
	}
);

export const auth_group = pgTable(
	'auth_group',
	{
		id: integer('id').primaryKey().notNull(),
		name: varchar('name', { length: 150 }).notNull()
	},
	(table) => {
		return {
			name_a6ea08ec_like: index('auth_group_name_a6ea08ec_like').using('btree', table.name),
			auth_group_name_key: unique('auth_group_name_key').on(table.name)
		};
	}
);

export const auth_group_permissions = pgTable(
	'auth_group_permissions',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		group_id: integer('group_id')
			.notNull()
			.references(() => auth_group.id),
		permission_id: integer('permission_id')
			.notNull()
			.references(() => auth_permission.id)
	},
	(table) => {
		return {
			group_id_b120cbf9: index('auth_group_permissions_group_id_b120cbf9').using(
				'btree',
				table.group_id
			),
			permission_id_84c5c92e: index('auth_group_permissions_permission_id_84c5c92e').using(
				'btree',
				table.permission_id
			),
			auth_group_permissions_group_id_permission_id_0cd325b0_uniq: unique(
				'auth_group_permissions_group_id_permission_id_0cd325b0_uniq'
			).on(table.group_id, table.permission_id)
		};
	}
);

export const auth_user = pgTable(
	'auth_user',
	{
		id: integer('id').primaryKey().notNull(),
		password: varchar('password', { length: 128 }).notNull(),
		last_login: timestamp('last_login', { withTimezone: true, mode: 'string' }),
		is_superuser: boolean('is_superuser').notNull(),
		username: varchar('username', { length: 150 }).notNull(),
		first_name: varchar('first_name', { length: 150 }).notNull(),
		last_name: varchar('last_name', { length: 150 }).notNull(),
		email: varchar('email', { length: 254 }).notNull(),
		is_staff: boolean('is_staff').notNull(),
		is_active: boolean('is_active').notNull(),
		date_joined: timestamp('date_joined', { withTimezone: true, mode: 'string' }).notNull()
	},
	(table) => {
		return {
			username_6821ab7c_like: index('auth_user_username_6821ab7c_like').using(
				'btree',
				table.username
			),
			auth_user_username_key: unique('auth_user_username_key').on(table.username)
		};
	}
);

export const auth_user_groups = pgTable(
	'auth_user_groups',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		user_id: integer('user_id')
			.notNull()
			.references(() => auth_user.id),
		group_id: integer('group_id')
			.notNull()
			.references(() => auth_group.id)
	},
	(table) => {
		return {
			group_id_97559544: index('auth_user_groups_group_id_97559544').using('btree', table.group_id),
			user_id_6a12ed8b: index('auth_user_groups_user_id_6a12ed8b').using('btree', table.user_id),
			auth_user_groups_user_id_group_id_94350c0c_uniq: unique(
				'auth_user_groups_user_id_group_id_94350c0c_uniq'
			).on(table.user_id, table.group_id)
		};
	}
);

export const auth_user_user_permissions = pgTable(
	'auth_user_user_permissions',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		user_id: integer('user_id')
			.notNull()
			.references(() => auth_user.id),
		permission_id: integer('permission_id')
			.notNull()
			.references(() => auth_permission.id)
	},
	(table) => {
		return {
			permission_id_1fbb5f2c: index('auth_user_user_permissions_permission_id_1fbb5f2c').using(
				'btree',
				table.permission_id
			),
			user_id_a95ead1b: index('auth_user_user_permissions_user_id_a95ead1b').using(
				'btree',
				table.user_id
			),
			auth_user_user_permissions_user_id_permission_id_14a6b632_uniq: unique(
				'auth_user_user_permissions_user_id_permission_id_14a6b632_uniq'
			).on(table.user_id, table.permission_id)
		};
	}
);

export const django_admin_log = pgTable(
	'django_admin_log',
	{
		id: integer('id').primaryKey().notNull(),
		action_time: timestamp('action_time', { withTimezone: true, mode: 'string' }).notNull(),
		object_id: text('object_id'),
		object_repr: varchar('object_repr', { length: 200 }).notNull(),
		action_flag: smallint('action_flag').notNull(),
		change_message: text('change_message').notNull(),
		content_type_id: integer('content_type_id').references(() => django_content_type.id),
		user_id: integer('user_id')
			.notNull()
			.references(() => auth_user.id)
	},
	(table) => {
		return {
			content_type_id_c4bce8eb: index('django_admin_log_content_type_id_c4bce8eb').using(
				'btree',
				table.content_type_id
			),
			user_id_c564eba6: index('django_admin_log_user_id_c564eba6').using('btree', table.user_id)
		};
	}
);

export const post = pgTable(
	'post',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		post_code: varchar('post_code', { length: 150 }).notNull(),
		pk_from_api: varchar('pk_from_api', { length: 150 }).notNull(),
		fb_id: varchar('fb_id', { length: 150 }).notNull(),
		num_of_likes: integer('num_of_likes').notNull(),
		num_of_comments: integer('num_of_comments').notNull(),
		last_checked: timestamp('last_checked', { withTimezone: true, mode: 'string' }).notNull(),
		crdate: varchar('crdate', { length: 150 }).notNull()
	},
	(table) => {
		return {
			main_app_post_post_code_de1d3bbc_like: index('main_app_post_post_code_de1d3bbc_like').using(
				'btree',
				table.post_code
			),
			main_app_post_post_code_key: unique('main_app_post_post_code_key').on(table.post_code)
		};
	}
);

export const public_profile = pgTable(
	'public_profile',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		username: varchar('username', { length: 150 }).notNull(),
		ig_id: varchar('ig_id', { length: 150 }).notNull(),
		pk_id: varchar('pk_id', { length: 150 }).notNull(),
		private_profile: boolean('private_profile').notNull(),
		registered_date: timestamp('registered_date', { withTimezone: true, mode: 'string' }).notNull(),
		last_checked: timestamp('last_checked', { withTimezone: true, mode: 'string' }).notNull()
	},
	(table) => {
		return {
			main_app_publicprofile_username_5564a5dc_like: index(
				'main_app_publicprofile_username_5564a5dc_like'
			).using('btree', table.username),
			main_app_publicprofile_username_key: unique('main_app_publicprofile_username_key').on(
				table.username
			)
		};
	}
);

export const public_profile_post_mm = pgTable(
	'public_profile_post_mm',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		public_profile_id: bigint('public_profile_id', { mode: 'number' })
			.notNull()
			.references(() => public_profile.id)
	},
	(table) => {
		return {
			main_app_publicprofilepostmm_public_profile_id_79e25d84: index(
				'main_app_publicprofilepostmm_public_profile_id_79e25d84'
			).using('btree', table.public_profile_id)
		};
	}
);

export const public_profile_post_mm_post = pgTable(
	'public_profile_post_mm_post',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		publicprofilepostmm_id: bigint('publicprofilepostmm_id', { mode: 'number' })
			.notNull()
			.references(() => public_profile_post_mm.id),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		post_id: bigint('post_id', { mode: 'number' })
			.notNull()
			.references(() => post.id)
	},
	(table) => {
		return {
			main_app_publicprofilepost_publicprofilepostmm_id_60f5545e: index(
				'main_app_publicprofilepost_publicprofilepostmm_id_60f5545e'
			).using('btree', table.publicprofilepostmm_id),
			main_app_publicprofilepostmm_post_post_id_034bf77f: index(
				'main_app_publicprofilepostmm_post_post_id_034bf77f'
			).using('btree', table.post_id),
			main_app_publicprofilepo_publicprofilepostmm_id_p_3e1410af_uniq: unique(
				'main_app_publicprofilepo_publicprofilepostmm_id_p_3e1410af_uniq'
			).on(table.publicprofilepostmm_id, table.post_id)
		};
	}
);

export const user_post_check_status = pgTable(
	'user_post_check_status',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		checked: boolean('checked'),
		follower: boolean('follower'),
		liker: boolean('liker'),
		commenter: boolean('commenter'),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		post_id: bigint('post_id', { mode: 'number' })
			.notNull()
			.references(() => post.id),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		user_id: bigint('user_id', { mode: 'number' })
			.notNull()
			.references(() => user_to_check.id)
	},
	(table) => {
		return {
			main_app_userpostcheckstatus_post_id_0d7f30b6: index(
				'main_app_userpostcheckstatus_post_id_0d7f30b6'
			).using('btree', table.post_id),
			main_app_userpostcheckstatus_user_id_6f23b115: index(
				'main_app_userpostcheckstatus_user_id_6f23b115'
			).using('btree', table.user_id),
			main_app_userpostcheckstatus_user_id_post_id_b9fdd2f2_uniq: unique(
				'main_app_userpostcheckstatus_user_id_post_id_b9fdd2f2_uniq'
			).on(table.post_id, table.user_id)
		};
	}
);

export const user_to_check = pgTable(
	'user_to_check',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		username: varchar('username', { length: 150 }).notNull(),
		full_name: varchar('full_name', { length: 255 }),
		is_private: boolean('is_private'),
		is_new: boolean('is_new'),
		pk_from_api: varchar('pk_from_api', { length: 255 })
	},
	(table) => {
		return {
			main_app_usertocheck_username_9d1f98b8_like: index(
				'main_app_usertocheck_username_9d1f98b8_like'
			).using('btree', table.username),
			main_app_usertocheck_username_key: unique('main_app_usertocheck_username_key').on(
				table.username
			)
		};
	}
);

export const api_call = pgTable('api_call', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	num_of_calls: integer('num_of_calls').notNull(),
	endpoint: varchar('endpoint', { length: 255 }),
	name: varchar('name', { length: 100 })
});

export const post_user_to_check_mm = pgTable(
	'post_user_to_check_mm',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		post_id: bigint('post_id', { mode: 'number' })
			.notNull()
			.references(() => post.id)
	},
	(table) => {
		return {
			main_app_postusertocheckmm_post_id_f2e4d0f9: index(
				'main_app_postusertocheckmm_post_id_f2e4d0f9'
			).using('btree', table.post_id)
		};
	}
);

export const post_user_to_check_mm_users_to_check = pgTable(
	'post_user_to_check_mm_users_to_check',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		postusertocheckmm_id: bigint('postusertocheckmm_id', { mode: 'number' })
			.notNull()
			.references(() => post_user_to_check_mm.id),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		userpostcheckstatus_id: bigint('userpostcheckstatus_id', { mode: 'number' })
			.notNull()
			.references(() => user_post_check_status.id)
	},
	(table) => {
		return {
			main_app_postusertocheckmm_postusertocheckmm_id_f15bc1da: index(
				'main_app_postusertocheckmm_postusertocheckmm_id_f15bc1da'
			).using('btree', table.postusertocheckmm_id),
			main_app_postusertocheckmm_userpostcheckstatus_id_2815edc8: index(
				'main_app_postusertocheckmm_userpostcheckstatus_id_2815edc8'
			).using('btree', table.userpostcheckstatus_id),
			main_app_postusertocheck_postusertocheckmm_id_use_d50c3c72_uniq: unique(
				'main_app_postusertocheck_postusertocheckmm_id_use_d50c3c72_uniq'
			).on(table.postusertocheckmm_id, table.userpostcheckstatus_id)
		};
	}
);

export const django_session = pgTable(
	'django_session',
	{
		session_key: varchar('session_key', { length: 40 }).primaryKey().notNull(),
		session_data: text('session_data').notNull(),
		expire_date: timestamp('expire_date', { withTimezone: true, mode: 'string' }).notNull()
	},
	(table) => {
		return {
			expire_date_a5c62663: index('django_session_expire_date_a5c62663').using(
				'btree',
				table.expire_date
			),
			session_key_c0390e0f_like: index('django_session_session_key_c0390e0f_like').using(
				'btree',
				table.session_key
			)
		};
	}
);

export const auth_session = pgTable('auth_session', {
	id: text('id').primaryKey().notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => login.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
	token: text('token').notNull()
});

export const login = pgTable(
	'login',
	{
		id: serial('id').primaryKey().notNull(),
		handle: text('handle').notNull(),
		email: text('email').notNull(),
		first_name: text('first_name').notNull(),
		last_name: text('last_name').notNull(),
		token: text('token').notNull(),
		verified: boolean('verified').default(false).notNull(),
		receive_email: boolean('receive_email').default(true).notNull(),
		hashed_password: text('hashed_password').notNull(),
		date_created: timestamp('date_created', { mode: 'string' }).defaultNow().notNull(),
		date_updated: timestamp('date_updated', { mode: 'string' }).defaultNow().notNull(),
		provider_id: text('provider_id'),
		provider: text('provider'),
		profile_pic: text('profile_pic'),
		social_media_profile: text('social_media_profile'),
		role: text('role').default('USER').notNull(),
		is_follower: boolean('is_follower').default(false).notNull(),
		is_creator: boolean('is_creator').default(false).notNull(),
		follower_count: integer('follower_count').default(0).notNull(),
		title: text('title'),
		tag_line: text('tag_line'),
		bio: text('bio'),
		terms: boolean('terms').default(false).notNull(),
		reward_name: text('reward_name'),
		store_name: text('store_name'),
		category: text('category'),
		stripe_customer_id: text('stripe_customer_id')
	},
	(table) => {
		return {
			emailUniqueIndex: uniqueIndex('emailUniqueIndex').using('btree', sql`lower(email)`),
			login_email_unique: unique('login_email_unique').on(table.email),
			login_token_unique: unique('login_token_unique').on(table.token)
		};
	}
);

export const plan_subscription = pgTable('plan_subscription', {
	id: serial('id').primaryKey().notNull(),
	creator_user_id: integer('creator_user_id')
		.notNull()
		.references(() => login.id, { onDelete: 'cascade' }),
	follower_user_id: integer('follower_user_id')
		.notNull()
		.references(() => login.id, { onDelete: 'cascade' }),
	date_started: timestamp('date_started', { mode: 'string' }).notNull(),
	plan_id: integer('plan_id')
		.notNull()
		.references(() => plan.id),
	stripe_subscription_id: text('stripe_subscription_id'),
	date_canceled: timestamp('date_canceled', { mode: 'string' })
});

export const plan = pgTable('plan', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	plan_percent: numeric('plan_percent').notNull(),
	plan_cost: numeric('plan_cost').notNull(),
	stripe_price_id: text('stripe_price_id'),
	description: text('description'),
	level: integer('level').default(0).notNull()
});

export const mission = pgTable('mission', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	platform: text('platform'),
	description: text('description')
});

export const product = pgTable('product', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	description: text('description'),
	cover_image: text('cover_image'),
	cost: numeric('cost', { precision: 10, scale: 2 }).default('0.00').notNull(),
	enabled: boolean('enabled').default(true).notNull(),
	creator_user_id: integer('creator_user_id')
		.notNull()
		.references(() => login.id, { onDelete: 'cascade' }),
	buyitnow_link: text('buyitnow_link')
});

export const product_invoice = pgTable('product_invoice', {
	id: serial('id').primaryKey().notNull(),
	product_id: integer('product_id').references(() => product.id),
	cost: numeric('cost', { precision: 10, scale: 2 }).default('0.00').notNull(),
	date_purchased: timestamp('date_purchased', { mode: 'string' }).defaultNow().notNull(),
	follower_user_id: integer('follower_user_id').references(() => login.id, { onDelete: 'cascade' }),
	creator_user_id: integer('creator_user_id').references(() => login.id)
});

export const mission_action = pgTable('mission_action', {
	id: serial('id').primaryKey().notNull(),
	mission_id: integer('mission_id')
		.notNull()
		.references(() => mission.id),
	name: text('name').notNull(),
	reward_per_day: integer('reward_per_day').default(0).notNull(),
	creator_user_id: integer('creator_user_id')
		.notNull()
		.references(() => login.id, { onDelete: 'cascade' }),
	description: text('description'),
	icon: text('icon')
});

export const product_item = pgTable('product_item', {
	id: serial('id').primaryKey().notNull(),
	name: text('name'),
	download_url: text('download_url'),
	product_id: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	file_name: text('file_name')
});

export const follower_creator = pgTable(
	'follower_creator',
	{
		follower_user_id: integer('follower_user_id')
			.notNull()
			.references(() => login.id, { onDelete: 'cascade' }),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login.id, { onDelete: 'cascade' })
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

export const mission_creator = pgTable(
	'mission_creator',
	{
		mission_id: integer('mission_id')
			.notNull()
			.references(() => mission.id),
		creator_user_id: integer('creator_user_id')
			.notNull()
			.references(() => login.id, { onDelete: 'cascade' }),
		enabled: boolean('enabled').default(true).notNull()
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
