import { relations } from "drizzle-orm/relations";
import { auth_user, auth_session, auth_key, login, reward_ledger, store, product, invoice, plan_subscription, plan, product_item, reward_action, mission, reward_earned, follower_creator } from "./schema";

export const auth_sessionRelations = relations(auth_session, ({one}) => ({
	auth_user: one(auth_user, {
		fields: [auth_session.user_id],
		references: [auth_user.id]
	}),
}));

export const auth_userRelations = relations(auth_user, ({many}) => ({
	auth_sessions: many(auth_session),
	auth_keys: many(auth_key),
}));

export const auth_keyRelations = relations(auth_key, ({one}) => ({
	auth_user: one(auth_user, {
		fields: [auth_key.user_id],
		references: [auth_user.id]
	}),
}));

export const reward_ledgerRelations = relations(reward_ledger, ({one}) => ({
	login: one(login, {
		fields: [reward_ledger.creator_id],
		references: [login.id]
	}),
}));

export const loginRelations = relations(login, ({many}) => ({
	reward_ledgers: many(reward_ledger),
	invoices: many(invoice),
	plan_subscriptions_creator_user_id: many(plan_subscription, {
		relationName: "plan_subscription_creator_user_id_login_id"
	}),
	plan_subscriptions_follower_user_id: many(plan_subscription, {
		relationName: "plan_subscription_follower_user_id_login_id"
	}),
	reward_actions: many(reward_action),
	reward_earneds_creator_user_id: many(reward_earned, {
		relationName: "reward_earned_creator_user_id_login_id"
	}),
	reward_earneds_follower_user_id: many(reward_earned, {
		relationName: "reward_earned_follower_user_id_login_id"
	}),
	follower_creators_creator_user_id: many(follower_creator, {
		relationName: "follower_creator_creator_user_id_login_id"
	}),
	follower_creators_follower_user_id: many(follower_creator, {
		relationName: "follower_creator_follower_user_id_login_id"
	}),
}));

export const productRelations = relations(product, ({one, many}) => ({
	store: one(store, {
		fields: [product.store_id],
		references: [store.id]
	}),
	invoices: many(invoice),
	product_items: many(product_item),
}));

export const storeRelations = relations(store, ({many}) => ({
	products: many(product),
}));

export const invoiceRelations = relations(invoice, ({one}) => ({
	login: one(login, {
		fields: [invoice.login_id],
		references: [login.id]
	}),
	product: one(product, {
		fields: [invoice.product_id],
		references: [product.id]
	}),
}));

export const plan_subscriptionRelations = relations(plan_subscription, ({one}) => ({
	login_creator_user_id: one(login, {
		fields: [plan_subscription.creator_user_id],
		references: [login.id],
		relationName: "plan_subscription_creator_user_id_login_id"
	}),
	login_follower_user_id: one(login, {
		fields: [plan_subscription.follower_user_id],
		references: [login.id],
		relationName: "plan_subscription_follower_user_id_login_id"
	}),
	plan: one(plan, {
		fields: [plan_subscription.plan_id],
		references: [plan.id]
	}),
}));

export const planRelations = relations(plan, ({many}) => ({
	plan_subscriptions: many(plan_subscription),
}));

export const product_itemRelations = relations(product_item, ({one}) => ({
	product: one(product, {
		fields: [product_item.product_id],
		references: [product.id]
	}),
}));

export const reward_actionRelations = relations(reward_action, ({one, many}) => ({
	login: one(login, {
		fields: [reward_action.creator_user_id],
		references: [login.id]
	}),
	mission: one(mission, {
		fields: [reward_action.mission_id],
		references: [mission.id]
	}),
	reward_earneds_action_id: many(reward_earned, {
		relationName: "reward_earned_action_id_reward_action_id"
	}),
	reward_earneds_reward_type_id: many(reward_earned, {
		relationName: "reward_earned_reward_type_id_reward_action_id"
	}),
}));

export const missionRelations = relations(mission, ({many}) => ({
	reward_actions: many(reward_action),
}));

export const reward_earnedRelations = relations(reward_earned, ({one}) => ({
	reward_action_action_id: one(reward_action, {
		fields: [reward_earned.action_id],
		references: [reward_action.id],
		relationName: "reward_earned_action_id_reward_action_id"
	}),
	login_creator_user_id: one(login, {
		fields: [reward_earned.creator_user_id],
		references: [login.id],
		relationName: "reward_earned_creator_user_id_login_id"
	}),
	login_follower_user_id: one(login, {
		fields: [reward_earned.follower_user_id],
		references: [login.id],
		relationName: "reward_earned_follower_user_id_login_id"
	}),
	reward_action_reward_type_id: one(reward_action, {
		fields: [reward_earned.reward_type_id],
		references: [reward_action.id],
		relationName: "reward_earned_reward_type_id_reward_action_id"
	}),
}));

export const follower_creatorRelations = relations(follower_creator, ({one}) => ({
	login_creator_user_id: one(login, {
		fields: [follower_creator.creator_user_id],
		references: [login.id],
		relationName: "follower_creator_creator_user_id_login_id"
	}),
	login_follower_user_id: one(login, {
		fields: [follower_creator.follower_user_id],
		references: [login.id],
		relationName: "follower_creator_follower_user_id_login_id"
	}),
}));