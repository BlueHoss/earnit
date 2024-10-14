import { relations } from 'drizzle-orm/relations';
import {
	mission,
	mission_default_action,
	login,
	credit_transaction,
	credit_follower_balance,
	credit_creator_balance,
	credit_distribution,
	django_content_type,
	auth_permission,
	auth_group_permissions,
	auth_group,
	auth_user_groups,
	auth_user,
	auth_user_user_permissions,
	django_admin_log,
	public_profile,
	public_profile_post_mm,
	post,
	public_profile_post_mm_post,
	user_post_check_status,
	user_to_check,
	post_user_to_check_mm,
	post_user_to_check_mm_users_to_check,
	auth_session,
	plan_subscription,
	plan,
	product,
	product_invoice,
	mission_action,
	product_item,
	follower_creator,
	mission_creator
} from './schema';

export const mission_default_actionRelations = relations(mission_default_action, ({ one }) => ({
	mission: one(mission, {
		fields: [mission_default_action.mission_id],
		references: [mission.id]
	})
}));

export const missionRelations = relations(mission, ({ many }) => ({
	mission_default_actions: many(mission_default_action),
	mission_actions: many(mission_action),
	mission_creators: many(mission_creator)
}));

export const credit_transactionRelations = relations(credit_transaction, ({ one }) => ({
	login_creator_user_id: one(login, {
		fields: [credit_transaction.creator_user_id],
		references: [login.id],
		relationName: 'credit_transaction_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login, {
		fields: [credit_transaction.follower_user_id],
		references: [login.id],
		relationName: 'credit_transaction_follower_user_id_login_id'
	})
}));

export const loginRelations = relations(login, ({ many }) => ({
	credit_transactions_creator_user_id: many(credit_transaction, {
		relationName: 'credit_transaction_creator_user_id_login_id'
	}),
	credit_transactions_follower_user_id: many(credit_transaction, {
		relationName: 'credit_transaction_follower_user_id_login_id'
	}),
	credit_follower_balances_creator_user_id: many(credit_follower_balance, {
		relationName: 'credit_follower_balance_creator_user_id_login_id'
	}),
	credit_follower_balances_follower_user_id: many(credit_follower_balance, {
		relationName: 'credit_follower_balance_follower_user_id_login_id'
	}),
	credit_creator_balances: many(credit_creator_balance),
	credit_distributions_creator_user_id: many(credit_distribution, {
		relationName: 'credit_distribution_creator_user_id_login_id'
	}),
	credit_distributions_earnit_creator_user_id: many(credit_distribution, {
		relationName: 'credit_distribution_earnit_creator_user_id_login_id'
	}),
	auth_sessions: many(auth_session),
	plan_subscriptions_creator_user_id: many(plan_subscription, {
		relationName: 'plan_subscription_creator_user_id_login_id'
	}),
	plan_subscriptions_follower_user_id: many(plan_subscription, {
		relationName: 'plan_subscription_follower_user_id_login_id'
	}),
	products: many(product),
	product_invoices_creator_user_id: many(product_invoice, {
		relationName: 'product_invoice_creator_user_id_login_id'
	}),
	product_invoices_follower_user_id: many(product_invoice, {
		relationName: 'product_invoice_follower_user_id_login_id'
	}),
	mission_actions: many(mission_action),
	follower_creators_creator_user_id: many(follower_creator, {
		relationName: 'follower_creator_creator_user_id_login_id'
	}),
	follower_creators_follower_user_id: many(follower_creator, {
		relationName: 'follower_creator_follower_user_id_login_id'
	}),
	mission_creators: many(mission_creator)
}));

export const credit_follower_balanceRelations = relations(credit_follower_balance, ({ one }) => ({
	login_creator_user_id: one(login, {
		fields: [credit_follower_balance.creator_user_id],
		references: [login.id],
		relationName: 'credit_follower_balance_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login, {
		fields: [credit_follower_balance.follower_user_id],
		references: [login.id],
		relationName: 'credit_follower_balance_follower_user_id_login_id'
	})
}));

export const credit_creator_balanceRelations = relations(credit_creator_balance, ({ one }) => ({
	login: one(login, {
		fields: [credit_creator_balance.creator_user_id],
		references: [login.id]
	})
}));

export const credit_distributionRelations = relations(credit_distribution, ({ one }) => ({
	login_creator_user_id: one(login, {
		fields: [credit_distribution.creator_user_id],
		references: [login.id],
		relationName: 'credit_distribution_creator_user_id_login_id'
	}),
	login_earnit_creator_user_id: one(login, {
		fields: [credit_distribution.earnit_creator_user_id],
		references: [login.id],
		relationName: 'credit_distribution_earnit_creator_user_id_login_id'
	})
}));

export const auth_permissionRelations = relations(auth_permission, ({ one, many }) => ({
	django_content_type: one(django_content_type, {
		fields: [auth_permission.content_type_id],
		references: [django_content_type.id]
	}),
	auth_group_permissions: many(auth_group_permissions),
	auth_user_user_permissions: many(auth_user_user_permissions)
}));

export const django_content_typeRelations = relations(django_content_type, ({ many }) => ({
	auth_permissions: many(auth_permission),
	django_admin_logs: many(django_admin_log)
}));

export const auth_group_permissionsRelations = relations(auth_group_permissions, ({ one }) => ({
	auth_permission: one(auth_permission, {
		fields: [auth_group_permissions.permission_id],
		references: [auth_permission.id]
	}),
	auth_group: one(auth_group, {
		fields: [auth_group_permissions.group_id],
		references: [auth_group.id]
	})
}));

export const auth_groupRelations = relations(auth_group, ({ many }) => ({
	auth_group_permissions: many(auth_group_permissions),
	auth_user_groups: many(auth_user_groups)
}));

export const auth_user_groupsRelations = relations(auth_user_groups, ({ one }) => ({
	auth_group: one(auth_group, {
		fields: [auth_user_groups.group_id],
		references: [auth_group.id]
	}),
	auth_user: one(auth_user, {
		fields: [auth_user_groups.user_id],
		references: [auth_user.id]
	})
}));

export const auth_userRelations = relations(auth_user, ({ many }) => ({
	auth_user_groups: many(auth_user_groups),
	auth_user_user_permissions: many(auth_user_user_permissions),
	django_admin_logs: many(django_admin_log)
}));

export const auth_user_user_permissionsRelations = relations(
	auth_user_user_permissions,
	({ one }) => ({
		auth_permission: one(auth_permission, {
			fields: [auth_user_user_permissions.permission_id],
			references: [auth_permission.id]
		}),
		auth_user: one(auth_user, {
			fields: [auth_user_user_permissions.user_id],
			references: [auth_user.id]
		})
	})
);

export const django_admin_logRelations = relations(django_admin_log, ({ one }) => ({
	django_content_type: one(django_content_type, {
		fields: [django_admin_log.content_type_id],
		references: [django_content_type.id]
	}),
	auth_user: one(auth_user, {
		fields: [django_admin_log.user_id],
		references: [auth_user.id]
	})
}));

export const public_profile_post_mmRelations = relations(
	public_profile_post_mm,
	({ one, many }) => ({
		public_profile: one(public_profile, {
			fields: [public_profile_post_mm.public_profile_id],
			references: [public_profile.id]
		}),
		public_profile_post_mm_posts: many(public_profile_post_mm_post)
	})
);

export const public_profileRelations = relations(public_profile, ({ many }) => ({
	public_profile_post_mms: many(public_profile_post_mm)
}));

export const public_profile_post_mm_postRelations = relations(
	public_profile_post_mm_post,
	({ one }) => ({
		post: one(post, {
			fields: [public_profile_post_mm_post.post_id],
			references: [post.id]
		}),
		public_profile_post_mm: one(public_profile_post_mm, {
			fields: [public_profile_post_mm_post.publicprofilepostmm_id],
			references: [public_profile_post_mm.id]
		})
	})
);

export const postRelations = relations(post, ({ many }) => ({
	public_profile_post_mm_posts: many(public_profile_post_mm_post),
	user_post_check_statuses: many(user_post_check_status),
	post_user_to_check_mms: many(post_user_to_check_mm)
}));

export const user_post_check_statusRelations = relations(
	user_post_check_status,
	({ one, many }) => ({
		post: one(post, {
			fields: [user_post_check_status.post_id],
			references: [post.id]
		}),
		user_to_check: one(user_to_check, {
			fields: [user_post_check_status.user_id],
			references: [user_to_check.id]
		}),
		post_user_to_check_mm_users_to_checks: many(post_user_to_check_mm_users_to_check)
	})
);

export const user_to_checkRelations = relations(user_to_check, ({ many }) => ({
	user_post_check_statuses: many(user_post_check_status)
}));

export const post_user_to_check_mmRelations = relations(post_user_to_check_mm, ({ one, many }) => ({
	post: one(post, {
		fields: [post_user_to_check_mm.post_id],
		references: [post.id]
	}),
	post_user_to_check_mm_users_to_checks: many(post_user_to_check_mm_users_to_check)
}));

export const post_user_to_check_mm_users_to_checkRelations = relations(
	post_user_to_check_mm_users_to_check,
	({ one }) => ({
		post_user_to_check_mm: one(post_user_to_check_mm, {
			fields: [post_user_to_check_mm_users_to_check.postusertocheckmm_id],
			references: [post_user_to_check_mm.id]
		}),
		user_post_check_status: one(user_post_check_status, {
			fields: [post_user_to_check_mm_users_to_check.userpostcheckstatus_id],
			references: [user_post_check_status.id]
		})
	})
);

export const auth_sessionRelations = relations(auth_session, ({ one }) => ({
	login: one(login, {
		fields: [auth_session.user_id],
		references: [login.id]
	})
}));

export const plan_subscriptionRelations = relations(plan_subscription, ({ one }) => ({
	login_creator_user_id: one(login, {
		fields: [plan_subscription.creator_user_id],
		references: [login.id],
		relationName: 'plan_subscription_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login, {
		fields: [plan_subscription.follower_user_id],
		references: [login.id],
		relationName: 'plan_subscription_follower_user_id_login_id'
	}),
	plan: one(plan, {
		fields: [plan_subscription.plan_id],
		references: [plan.id]
	})
}));

export const planRelations = relations(plan, ({ many }) => ({
	plan_subscriptions: many(plan_subscription)
}));

export const productRelations = relations(product, ({ one, many }) => ({
	login: one(login, {
		fields: [product.creator_user_id],
		references: [login.id]
	}),
	product_invoices: many(product_invoice),
	product_items: many(product_item)
}));

export const product_invoiceRelations = relations(product_invoice, ({ one }) => ({
	login_creator_user_id: one(login, {
		fields: [product_invoice.creator_user_id],
		references: [login.id],
		relationName: 'product_invoice_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login, {
		fields: [product_invoice.follower_user_id],
		references: [login.id],
		relationName: 'product_invoice_follower_user_id_login_id'
	}),
	product: one(product, {
		fields: [product_invoice.product_id],
		references: [product.id]
	})
}));

export const mission_actionRelations = relations(mission_action, ({ one }) => ({
	login: one(login, {
		fields: [mission_action.creator_user_id],
		references: [login.id]
	}),
	mission: one(mission, {
		fields: [mission_action.mission_id],
		references: [mission.id]
	})
}));

export const product_itemRelations = relations(product_item, ({ one }) => ({
	product: one(product, {
		fields: [product_item.product_id],
		references: [product.id]
	})
}));

export const follower_creatorRelations = relations(follower_creator, ({ one }) => ({
	login_creator_user_id: one(login, {
		fields: [follower_creator.creator_user_id],
		references: [login.id],
		relationName: 'follower_creator_creator_user_id_login_id'
	}),
	login_follower_user_id: one(login, {
		fields: [follower_creator.follower_user_id],
		references: [login.id],
		relationName: 'follower_creator_follower_user_id_login_id'
	})
}));

export const mission_creatorRelations = relations(mission_creator, ({ one }) => ({
	login: one(login, {
		fields: [mission_creator.creator_user_id],
		references: [login.id]
	}),
	mission: one(mission, {
		fields: [mission_creator.mission_id],
		references: [mission.id]
	})
}));
