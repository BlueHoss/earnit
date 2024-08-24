ALTER TABLE "product_invoice" ADD COLUMN "creator_user_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
