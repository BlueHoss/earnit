ALTER TABLE "product" ADD COLUMN "buyitnow_link" text;--> statement-breakpoint
ALTER TABLE "product_item" DROP COLUMN IF EXISTS "buyitnow_link";