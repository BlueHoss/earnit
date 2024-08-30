ALTER TABLE "product_item" DROP CONSTRAINT "product_item_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "store_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_item" ADD CONSTRAINT "product_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
