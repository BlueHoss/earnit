ALTER TABLE "login" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "login" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_login_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
