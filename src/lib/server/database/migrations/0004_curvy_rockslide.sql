DROP TABLE "auth_key";--> statement-breakpoint
ALTER TABLE "invoice" RENAME TO "product_invoice";--> statement-breakpoint
ALTER TABLE "product_invoice" DROP CONSTRAINT "invoice_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product_invoice" DROP CONSTRAINT "invoice_login_id_login_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_login_id_login_id_fk" FOREIGN KEY ("login_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
