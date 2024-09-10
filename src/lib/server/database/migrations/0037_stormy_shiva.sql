ALTER TABLE "credit_follower_balance" DROP CONSTRAINT "credit_follower_balance_follower_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transaction" DROP CONSTRAINT "credit_transaction_follower_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transaction" DROP CONSTRAINT "credit_transaction_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "follower_creator" DROP CONSTRAINT "follower_creator_follower_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "follower_creator" DROP CONSTRAINT "follower_creator_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "mission_action" DROP CONSTRAINT "mission_action_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "mission_creator" DROP CONSTRAINT "mission_creator_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_subscription" DROP CONSTRAINT "plan_subscription_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_subscription" DROP CONSTRAINT "plan_subscription_follower_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "product_invoice" DROP CONSTRAINT "product_invoice_follower_user_id_login_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_balance" ADD CONSTRAINT "credit_follower_balance_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_creator" ADD CONSTRAINT "follower_creator_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_creator" ADD CONSTRAINT "follower_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_action" ADD CONSTRAINT "mission_action_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_creator" ADD CONSTRAINT "mission_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
