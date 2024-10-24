ALTER TABLE "credit_distribution" RENAME TO "credit_creator_distribution";--> statement-breakpoint
ALTER TABLE "reward_distribution" RENAME TO "credit_follower_distribution";--> statement-breakpoint
ALTER TABLE "credit_transaction" RENAME COLUMN "reward_distribution_id" TO "credit_follower_distribution_id";--> statement-breakpoint
ALTER TABLE "credit_creator_distribution" DROP CONSTRAINT "credit_distribution_earnit_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_creator_distribution" DROP CONSTRAINT "credit_distribution_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transaction" DROP CONSTRAINT "credit_transaction_reward_distribution_id_reward_distribution_id_fk";
--> statement-breakpoint
--Set these manually in the db!!
--Manual ALTER TABLE "credit_creator_balance" ALTER COLUMN "date_updated" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
--Manual ALTER TABLE "credit_creator_distribution" ALTER COLUMN "date_transaction" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
--Manual ALTER TABLE "credit_transaction" ALTER COLUMN "date_transaction" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
--Manual ALTER TABLE "login" ALTER COLUMN "date_created" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
--Manual ALTER TABLE "login" ALTER COLUMN "date_updated" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
--Manual ALTER TABLE "product_invoice" ALTER COLUMN "date_purchased" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
--Manual ALTER TABLE "credit_follower_distribution" ALTER COLUMN "date_transaction" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_creator_distribution" ADD CONSTRAINT "credit_creator_distribution_earnit_creator_user_id_login_id_fk" FOREIGN KEY ("earnit_creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_creator_distribution" ADD CONSTRAINT "credit_creator_distribution_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_credit_follower_distribution_id_credit_follower_distribution_id_fk" FOREIGN KEY ("credit_follower_distribution_id") REFERENCES "public"."credit_follower_distribution"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
