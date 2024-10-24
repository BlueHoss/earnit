ALTER TABLE "credit_follower_balance" DROP CONSTRAINT "credit_follower_balance_creator_user_id_login_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_balance" ADD CONSTRAINT "credit_follower_balance_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
