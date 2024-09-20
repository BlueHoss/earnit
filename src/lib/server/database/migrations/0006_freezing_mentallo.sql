CREATE TABLE IF NOT EXISTS "credit_distribution" (
	"id" serial PRIMARY KEY NOT NULL,
	"earnit_creator_user_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_transaction" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_distribution" ADD CONSTRAINT "credit_distribution_earnit_creator_user_id_login_id_fk" FOREIGN KEY ("earnit_creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_distribution" ADD CONSTRAINT "credit_distribution_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
