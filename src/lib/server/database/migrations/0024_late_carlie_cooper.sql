ALTER TABLE "mission_action" ALTER COLUMN "mission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mission_action" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mission_action" ALTER COLUMN "reward_per_day" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "mission_action" ALTER COLUMN "reward_per_day" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "mission_action" ALTER COLUMN "reward_per_day" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mission_action" ALTER COLUMN "creator_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_subscription" ALTER COLUMN "date_started" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_invoice" ALTER COLUMN "date_purchased" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "product_invoice" ALTER COLUMN "date_purchased" SET NOT NULL;