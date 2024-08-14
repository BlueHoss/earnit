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
CREATE TABLE IF NOT EXISTS "auth_key" (
	"id" serial PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follower_creator" (
	"follower_user_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	CONSTRAINT "follower_creator_pkey" PRIMARY KEY("follower_user_id","creator_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"cost" numeric,
	"date_purchased" timestamp,
	"login_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"token" text,
	"verified" boolean DEFAULT false NOT NULL,
	"receive_email" boolean DEFAULT true NOT NULL,
	"hashed_password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"provider_id" text,
	"provider" text,
	"profile_pic" text,
	"social_media_profile" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"is_follower" boolean DEFAULT false NOT NULL,
	"is_creator" boolean DEFAULT false NOT NULL,
	CONSTRAINT "login_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mission" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"platform" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plan_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_user_id" integer,
	"follower_user_id" integer,
	"date_started" timestamp,
	"plan_id" integer,
	"date_canceled" timestamp,
	"active" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"plan_percent" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"download_url" text,
	"product_id" integer,
	"buyitnow_link" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"store_id" integer,
	"cover_image" text,
	"cost" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reward_action" (
	"id" serial PRIMARY KEY NOT NULL,
	"mission_id" integer,
	"name" text,
	"reward_per_day" numeric,
	"creator_user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reward_earned" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_user_id" integer,
	"date_awarded" timestamp,
	"reward_type_id" integer,
	"reward_value" numeric,
	"creator_user_id" integer,
	"action_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reward_ledger" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_earned" timestamp,
	"amount" numeric,
	"creator_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"creator_user_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_login_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."login"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_creator" ADD CONSTRAINT "follower_creator_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follower_creator" ADD CONSTRAINT "follower_creator_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_login_id_login_id_fk" FOREIGN KEY ("login_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_subscription" ADD CONSTRAINT "plan_subscription_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "product_item" ADD CONSTRAINT "product_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_action" ADD CONSTRAINT "reward_action_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_action" ADD CONSTRAINT "reward_action_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_earned" ADD CONSTRAINT "reward_earned_follower_user_id_login_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_earned" ADD CONSTRAINT "reward_earned_reward_type_id_reward_action_id_fk" FOREIGN KEY ("reward_type_id") REFERENCES "public"."reward_action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_earned" ADD CONSTRAINT "reward_earned_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_earned" ADD CONSTRAINT "reward_earned_action_id_reward_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."reward_action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_ledger" ADD CONSTRAINT "reward_ledger_creator_id_login_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_auth_key_user_id" ON "auth_key" USING btree ("user_id");