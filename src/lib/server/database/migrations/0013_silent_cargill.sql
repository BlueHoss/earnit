ALTER TABLE "login" ALTER COLUMN "social_media_profile" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_invoice" ALTER COLUMN "cost" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_invoice" ALTER COLUMN "cost" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "product_invoice" ALTER COLUMN "cost" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "cost" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "cost" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "cost" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "login" ADD COLUMN "terms" boolean DEFAULT false NOT NULL;