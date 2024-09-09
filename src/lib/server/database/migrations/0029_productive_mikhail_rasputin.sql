CREATE TABLE IF NOT EXISTS "creator_credit_pool" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_user_id" integer,
	"total_credits" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_type" text,
	"description" text,
	"follower_user_id" integer,
	"creator_user_id" integer,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_transaction" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follower_credit_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_user_id" integer,
	"creator_user_id" integer,
	"credit_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_credit_pool" ADD CONSTRAINT "creator_credit_pool_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_credit_balance" ADD CONSTRAINT "follower_credit_balance_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_credit_balance" ADD CONSTRAINT "follower_credit_balance_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
