ALTER TABLE "credit_creator_pool" ALTER COLUMN "creator_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_follower_balance" ALTER COLUMN "follower_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_follower_balance" ALTER COLUMN "creator_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transaction" ALTER COLUMN "follower_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transaction" ALTER COLUMN "creator_user_id" SET NOT NULL;