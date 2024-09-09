ALTER TABLE "creator_credit_pool" RENAME TO "credit_creator_pool";--> statement-breakpoint
ALTER TABLE "follower_credit_balance" RENAME TO "credit_follower_balance";--> statement-breakpoint
ALTER TABLE "credit_creator_pool" DROP CONSTRAINT "creator_credit_pool_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_follower_balance" DROP CONSTRAINT "follower_credit_balance_follower_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_follower_balance" DROP CONSTRAINT "follower_credit_balance_creator_user_id_login_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_creator_credit_pool_creator_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_follower_credit_balance_follower_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_follower_credit_balance_creator_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_creator_pool" ADD CONSTRAINT "credit_creator_pool_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_balance" ADD CONSTRAINT "credit_follower_balance_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_balance" ADD CONSTRAINT "credit_follower_balance_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_creator_pool_creator_id" ON "credit_creator_pool" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_follower_balance_follower_id" ON "credit_follower_balance" USING btree ("follower_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_follower_balance_creator_id" ON "credit_follower_balance" USING btree ("creator_user_id");