CREATE TABLE IF NOT EXISTS "mission_creator" (
	"mission_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	CONSTRAINT "follower_mission_pkey" PRIMARY KEY("mission_id","creator_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_creator" ADD CONSTRAINT "mission_creator_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_creator" ADD CONSTRAINT "mission_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
