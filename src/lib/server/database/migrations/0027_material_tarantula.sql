CREATE TABLE IF NOT EXISTS "follower_action" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_user_id" integer NOT NULL,
	"follower_user_id" integer NOT NULL,
	"mission_action_id" integer NOT NULL,
	"credits" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"date_added" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_action" ADD CONSTRAINT "follower_action_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_action" ADD CONSTRAINT "follower_action_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_action" ADD CONSTRAINT "follower_action_mission_action_id_mission_action_id_fk" FOREIGN KEY ("mission_action_id") REFERENCES "public"."mission_action"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
