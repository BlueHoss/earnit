CREATE TABLE IF NOT EXISTS "earnit_scanner_creator" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_user_id" integer NOT NULL,
	"scanner_creator_id" integer NOT NULL,
	"date_added" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "earnit_scanner_follower" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_user_id" integer NOT NULL,
	"scanner_follower_id" integer NOT NULL,
	"date_added" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnit_scanner_creator" ADD CONSTRAINT "earnit_scanner_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnit_scanner_follower" ADD CONSTRAINT "earnit_scanner_follower_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
