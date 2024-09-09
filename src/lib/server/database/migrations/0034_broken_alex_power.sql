ALTER TABLE "credit_creator_pool" ALTER COLUMN "available_credits" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "credit_creator_pool" ALTER COLUMN "available_credits" SET NOT NULL;