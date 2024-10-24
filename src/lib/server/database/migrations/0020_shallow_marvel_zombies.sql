CREATE TABLE IF NOT EXISTS "reward_distribution" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_transaction" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reward_distribution_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"reward_distribution_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	"follower_user_id" integer NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_distribution_detail" ADD CONSTRAINT "reward_distribution_detail_reward_distribution_id_reward_distribution_id_fk" FOREIGN KEY ("reward_distribution_id") REFERENCES "public"."reward_distribution"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_distribution_detail" ADD CONSTRAINT "reward_distribution_detail_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_distribution_detail" ADD CONSTRAINT "reward_distribution_detail_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
