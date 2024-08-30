DROP TABLE "store";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_store_id_store_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "creator_user_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "login" USING btree (lower("email"));--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN IF EXISTS "store_id";