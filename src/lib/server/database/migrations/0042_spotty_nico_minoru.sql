ALTER TABLE "plan_subscription" ALTER COLUMN "creator_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_subscription" ALTER COLUMN "follower_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_subscription" ALTER COLUMN "plan_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_subscription" DROP COLUMN IF EXISTS "active";