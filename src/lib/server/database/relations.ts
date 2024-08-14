import { relations } from 'drizzle-orm/relations';
import {
	auth_session_table,
	auth_key_table,
	login_table,
	reward_ledger_table,
	store_table,
	product_table,
	invoice_table,
	plan_subscription_table,
	plan_table,
	product_item_table,
	reward_action_table,
	mission_table,
	reward_earned_table,
	follower_creator_table
} from '$lib/server/database/schema';

export const auth_sessionRelations = relations(auth_session_table, ({ one }) => ({
	auth_user: one(login_table, {
		fields: [auth_session_table.user_id],
		references: [login_table.id]
	})
}));

export const auth_userRelations = relations(login_table, ({ many }) => ({
	auth_sessions: many(auth_session_table),
	auth_keys: many(auth_key_table)
}));

export const auth_keyRelations = relations(auth_key_table, ({ one }) => ({
	auth_user: one(login_table, {
		fields: [auth_key_table.user_id],
		references: [login_table.id]
	})
}));

export const reward_ledgerRelations = relations(reward_ledger_table, ({ one }) => ({
	login: one(login_table, {
		fields: [reward_ledger_table.creator_id],
		references: [login_table.id]
	})
}));

export const loginRelations = relations(login_table, ({ many }) => ({
	reward_ledgers: many(reward_ledger_table),
	invoices: many(invoice_table),
	plan_subscriptions_creator_user_id: many(plan_subscription_table, {
		relationName: 'plan_subscription_creator_user_id_login_id'
	}),
	plan_subscriptions_follower_user_id: many(plan_subscription_table, {
		relationName: 'plan_subscription_follower_user_id_login_id'
	}),
	reward_actions: many(reward_action_table),
	reward_earneds_creator_user_id: many(reward_earned_table, {
		relationName: 'reward_earned_creator_user_id_login_id'
	}),
	reward_earneds_follower_user_id: many(reward_earned_table, {
		relationName: 'reward_earned_follower_user_id_login_id'
	}),
	follower_creators_creator_user_id: many(follower_creator_table, {
		relationName: 'follower_creator_creator_user_id_login_id'
	}),
	follower_creators_follower_user_id: many(follower_creator_table, {
		relationName: 'follower_creator_follower_user_id_login_id'
	})
}));

export const productRelations = relations(product_table, ({ one, many }) => ({
	store: one(store_table, {
		fields: [product_table.store_id],
		references: [store_table.id]
	}),
	invoices: many(invoice_table),
	product_items: many(product_item_table)
}));

export const storeRelations = relations(store_table, ({ many }) => ({
	products: many(product_table)
}));

export const invoiceRelations = relations(invoice_table, ({ one }) => ({
	login: one(login_table, {
		fields: [invoice_table.login_id],
		references: [login_table.id]
	}),
	product: one(product_table, {
		fields: [invoice_table.product_id],
		references: [product_table.id]
	})
}));

export const plan_subscriptionRelations = relations(plan_subscription_table, ({ one }) => ({
	login_creator_user_id: one(login_table, {
		fields: [plan_subscription_table.creator_user_id],
		references: [login_table.id],
		relationName: 'plan_subscription_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login_table, {
		fields: [plan_subscription_table.follower_user_id],
		references: [login_table.id],
		relationName: 'plan_subscription_follower_user_id_login_id'
	}),
	plan: one(plan_table, {
		fields: [plan_subscription_table.plan_id],
		references: [plan_table.id]
	})
}));

export const planRelations = relations(plan_table, ({ many }) => ({
	plan_subscriptions: many(plan_subscription_table)
}));

export const product_itemRelations = relations(product_item_table, ({ one }) => ({
	product: one(product_table, {
		fields: [product_item_table.product_id],
		references: [product_table.id]
	})
}));

export const reward_actionRelations = relations(reward_action_table, ({ one, many }) => ({
	login: one(login_table, {
		fields: [reward_action_table.creator_user_id],
		references: [login_table.id]
	}),
	mission: one(mission_table, {
		fields: [reward_action_table.mission_id],
		references: [mission_table.id]
	}),
	reward_earneds_action_id: many(reward_earned_table, {
		relationName: 'reward_earned_action_id_reward_action_id'
	}),
	reward_earneds_reward_type_id: many(reward_earned_table, {
		relationName: 'reward_earned_reward_type_id_reward_action_id'
	})
}));

export const missionRelations = relations(mission_table, ({ many }) => ({
	reward_actions: many(reward_action_table)
}));

export const reward_earnedRelations = relations(reward_earned_table, ({ one }) => ({
	reward_action_action_id: one(reward_action_table, {
		fields: [reward_earned_table.action_id],
		references: [reward_action_table.id],
		relationName: 'reward_earned_action_id_reward_action_id'
	}),
	login_creator_user_id: one(login_table, {
		fields: [reward_earned_table.creator_user_id],
		references: [login_table.id],
		relationName: 'reward_earned_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login_table, {
		fields: [reward_earned_table.follower_user_id],
		references: [login_table.id],
		relationName: 'reward_earned_follower_user_id_login_id'
	}),
	reward_action_reward_type_id: one(reward_action_table, {
		fields: [reward_earned_table.reward_type_id],
		references: [reward_action_table.id],
		relationName: 'reward_earned_reward_type_id_reward_action_id'
	})
}));

export const follower_creatorRelations = relations(follower_creator_table, ({ one }) => ({
	login_creator_user_id: one(login_table, {
		fields: [follower_creator_table.creator_user_id],
		references: [login_table.id],
		relationName: 'follower_creator_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login_table, {
		fields: [follower_creator_table.follower_user_id],
		references: [login_table.id],
		relationName: 'follower_creator_follower_user_id_login_id'
	})
}));
