ALTER TABLE "credit_creator_pool" RENAME TO "credit_creator_balance";--> statement-breakpoint
ALTER TABLE "credit_creator_balance" DROP CONSTRAINT "credit_creator_pool_creator_user_id_login_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_credit_creator_pool_creator_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_creator_balance" ADD CONSTRAINT "credit_creator_balance_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_creator_balance_creator_id" ON "credit_creator_balance" USING btree ("creator_user_id");