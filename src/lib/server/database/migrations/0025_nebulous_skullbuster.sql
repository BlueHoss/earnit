--Set this manually in the db!!
-- ALTER TABLE "auth_session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
-- ALTER TABLE "earnit_scanner_creator" ALTER COLUMN "date_added" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
-- ALTER TABLE "earnit_scanner_follower" ALTER COLUMN "date_added" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
-- ALTER TABLE "plan_subscription" ALTER COLUMN "date_started" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
-- ALTER TABLE "plan_subscription" ALTER COLUMN "date_canceled" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ADD COLUMN "creator_user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ADD COLUMN "follower_user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ADD COLUMN "mission_action_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_follower_distribution" ADD COLUMN "user_post_check_status_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_distribution" ADD CONSTRAINT "credit_follower_distribution_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_distribution" ADD CONSTRAINT "credit_follower_distribution_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_distribution" ADD CONSTRAINT "credit_follower_distribution_mission_action_id_mission_action_id_fk" FOREIGN KEY ("mission_action_id") REFERENCES "public"."mission_action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
