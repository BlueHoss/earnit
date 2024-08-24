ALTER TABLE "product_invoice" RENAME COLUMN "login_id" TO "follower_user_id";--> statement-breakpoint
ALTER TABLE "product_invoice" DROP CONSTRAINT "product_invoice_login_id_login_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
