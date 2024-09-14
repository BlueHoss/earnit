DO $$ BEGIN
 CREATE TYPE "public"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_type" AS ENUM('totp', 'webauthn', 'phone');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_creator_pool" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_user_id" integer NOT NULL,
	"total_credits" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"available_credits" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_follower_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_user_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	"credit_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_type" text,
	"description" text,
	"follower_user_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_transaction" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follower_creator" (
	"follower_user_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	CONSTRAINT "follower_creator_pkey" PRIMARY KEY("follower_user_id","creator_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login" (
	"id" serial PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"token" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"receive_email" boolean DEFAULT true NOT NULL,
	"hashed_password" text NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"provider_id" text,
	"provider" text,
	"profile_pic" text,
	"terms" boolean DEFAULT false NOT NULL,
	"social_media_profile" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"is_follower" boolean DEFAULT false NOT NULL,
	"is_creator" boolean DEFAULT false NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"title" text,
	"tag_line" text,
	"bio" text,
	"reward_name" text,
	"store_name" text,
	"credit_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"category" text,
	CONSTRAINT "login_email_unique" UNIQUE("email"),
	CONSTRAINT "login_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mission_action" (
	"id" serial PRIMARY KEY NOT NULL,
	"mission_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"reward_per_day" integer DEFAULT 0 NOT NULL,
	"creator_user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mission_creator" (
	"mission_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "follower_mission_pkey" PRIMARY KEY("mission_id","creator_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mission_default_action" (
	"id" serial PRIMARY KEY NOT NULL,
	"mission_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"reward_per_day" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mission" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"platform" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plan_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_user_id" integer NOT NULL,
	"follower_user_id" integer NOT NULL,
	"date_started" timestamp NOT NULL,
	"plan_id" integer NOT NULL,
	"date_canceled" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"plan_percent" numeric NOT NULL,
	"plan_cost" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"cost" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"date_purchased" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"creator_user_id" integer,
	"follower_user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"file_name" text,
	"download_url" text,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"creator_user_id" integer NOT NULL,
	"cover_image" text,
	"cost" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"buyitnow_link" text,
	"enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_login_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_creator_pool" ADD CONSTRAINT "credit_creator_pool_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_balance" ADD CONSTRAINT "credit_follower_balance_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_follower_balance" ADD CONSTRAINT "credit_follower_balance_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_creator" ADD CONSTRAINT "follower_creator_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_creator" ADD CONSTRAINT "follower_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_action" ADD CONSTRAINT "mission_action_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_action" ADD CONSTRAINT "mission_action_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_creator" ADD CONSTRAINT "mission_creator_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_creator" ADD CONSTRAINT "mission_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_default_action" ADD CONSTRAINT "mission_default_action_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_invoice" ADD CONSTRAINT "product_invoice_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_item" ADD CONSTRAINT "product_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_creator_pool_creator_id" ON "credit_creator_pool" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_follower_balance_follower_id" ON "credit_follower_balance" USING btree ("follower_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_follower_balance_creator_id" ON "credit_follower_balance" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_creator_id" ON "credit_transaction" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_follower_id" ON "credit_transaction" USING btree ("follower_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "login" USING btree (lower("email"));