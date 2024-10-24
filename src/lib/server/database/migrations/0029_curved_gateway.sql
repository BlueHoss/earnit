ALTER TABLE "credit_follower_distribution" DROP CONSTRAINT "credit_follower_distribution_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" DROP CONSTRAINT "credit_follower_distribution_follower_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" DROP CONSTRAINT "credit_follower_distribution_mission_action_id_mission_action_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ALTER COLUMN "date_transaction" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ALTER COLUMN "date_transaction" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ALTER COLUMN "status" SET DEFAULT 'running';--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ADD COLUMN "actions_processed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" DROP COLUMN IF EXISTS "creator_user_id";--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" DROP COLUMN IF EXISTS "follower_user_id";--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" DROP COLUMN IF EXISTS "mission_action_id";--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" DROP COLUMN IF EXISTS "user_post_check_status_id";