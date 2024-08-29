ALTER TABLE "auth_session" DROP CONSTRAINT "auth_session_user_id_login_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_login_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
