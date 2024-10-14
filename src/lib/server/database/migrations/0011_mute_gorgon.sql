CREATE TABLE IF NOT EXISTS "api_call" (
	"id" bigint PRIMARY KEY NOT NULL,
	"num_of_calls" integer NOT NULL,
	"endpoint" varchar(255),
	"name" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_group" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	CONSTRAINT "auth_group_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_group_permissions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" UNIQUE("group_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_permission" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"content_type_id" integer NOT NULL,
	"codename" varchar(100) NOT NULL,
	CONSTRAINT "auth_permission_content_type_id_codename_01ab375a_uniq" UNIQUE("content_type_id","codename")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" integer PRIMARY KEY NOT NULL,
	"password" varchar(128) NOT NULL,
	"last_login" timestamp with time zone,
	"is_superuser" boolean NOT NULL,
	"username" varchar(150) NOT NULL,
	"first_name" varchar(150) NOT NULL,
	"last_name" varchar(150) NOT NULL,
	"email" varchar(254) NOT NULL,
	"is_staff" boolean NOT NULL,
	"is_active" boolean NOT NULL,
	"date_joined" timestamp with time zone NOT NULL,
	CONSTRAINT "auth_user_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user_groups" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "auth_user_groups_user_id_group_id_94350c0c_uniq" UNIQUE("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user_user_permissions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "auth_user_user_permissions_user_id_permission_id_14a6b632_uniq" UNIQUE("user_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_admin_log" (
	"id" integer PRIMARY KEY NOT NULL,
	"action_time" timestamp with time zone NOT NULL,
	"object_id" text,
	"object_repr" varchar(200) NOT NULL,
	"action_flag" smallint NOT NULL,
	"change_message" text NOT NULL,
	"content_type_id" integer,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_content_type" (
	"id" integer PRIMARY KEY NOT NULL,
	"app_label" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	CONSTRAINT "django_content_type_app_label_model_76bd3d3b_uniq" UNIQUE("app_label","model")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_migrations" (
	"id" bigint PRIMARY KEY NOT NULL,
	"app" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"applied" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "django_session" (
	"session_key" varchar(40) PRIMARY KEY NOT NULL,
	"session_data" text NOT NULL,
	"expire_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follower_creator" (
	"follower_user_id" integer NOT NULL,
	"creator_user_id" integer NOT NULL,
	CONSTRAINT "follower_creator_pkey" PRIMARY KEY("follower_user_id","creator_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" bigint PRIMARY KEY NOT NULL,
	"post_code" varchar(150) NOT NULL,
	"pk_from_api" varchar(150) NOT NULL,
	"fb_id" varchar(150) NOT NULL,
	"num_of_likes" integer NOT NULL,
	"num_of_comments" integer NOT NULL,
	"last_checked" timestamp with time zone NOT NULL,
	"crdate" varchar(150) NOT NULL,
	CONSTRAINT "main_app_post_post_code_key" UNIQUE("post_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_user_to_check_mm" (
	"id" bigint PRIMARY KEY NOT NULL,
	"post_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_user_to_check_mm_users_to_check" (
	"id" bigint PRIMARY KEY NOT NULL,
	"postusertocheckmm_id" bigint NOT NULL,
	"userpostcheckstatus_id" bigint NOT NULL,
	CONSTRAINT "main_app_postusertocheck_postusertocheckmm_id_use_d50c3c72_uniq" UNIQUE("postusertocheckmm_id","userpostcheckstatus_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public_profile" (
	"id" bigint PRIMARY KEY NOT NULL,
	"username" varchar(150) NOT NULL,
	"ig_id" varchar(150) NOT NULL,
	"pk_id" varchar(150) NOT NULL,
	"private_profile" boolean NOT NULL,
	"registered_date" timestamp with time zone NOT NULL,
	"last_checked" timestamp with time zone NOT NULL,
	CONSTRAINT "main_app_publicprofile_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public_profile_post_mm" (
	"id" bigint PRIMARY KEY NOT NULL,
	"public_profile_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public_profile_post_mm_post" (
	"id" bigint PRIMARY KEY NOT NULL,
	"publicprofilepostmm_id" bigint NOT NULL,
	"post_id" bigint NOT NULL,
	CONSTRAINT "main_app_publicprofilepo_publicprofilepostmm_id_p_3e1410af_uniq" UNIQUE("publicprofilepostmm_id","post_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_post_check_status" (
	"id" bigint PRIMARY KEY NOT NULL,
	"checked" boolean,
	"follower" boolean,
	"liker" boolean,
	"commenter" boolean,
	"post_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "main_app_userpostcheckstatus_user_id_post_id_b9fdd2f2_uniq" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_check" (
	"id" bigint PRIMARY KEY NOT NULL,
	"username" varchar(150) NOT NULL,
	"full_name" varchar(255),
	"is_private" boolean,
	"is_new" boolean,
	"pk_from_api" varchar(255),
	CONSTRAINT "main_app_usertocheck_username_key" UNIQUE("username")
);
--> statement-breakpoint
DROP INDEX IF EXISTS "emailUniqueIndex";--> statement-breakpoint
ALTER TABLE "credit_creator_balance" ALTER COLUMN "credit_balance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_invoice" ALTER COLUMN "date_purchased" SET DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_auth_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_permission_id_auth_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_django_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_user_groups" ADD CONSTRAINT "auth_user_groups_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_user_groups" ADD CONSTRAINT "auth_user_groups_group_id_auth_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_permission_id_auth_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_django_content_type_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "post_user_to_check_mm" ADD CONSTRAINT "post_user_to_check_mm_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_user_to_check_mm_users_to_check" ADD CONSTRAINT "post_user_to_check_mm_users_to_check_postusertocheckmm_id_post_user_to_check_mm_id_fk" FOREIGN KEY ("postusertocheckmm_id") REFERENCES "public"."post_user_to_check_mm"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_user_to_check_mm_users_to_check" ADD CONSTRAINT "post_user_to_check_mm_users_to_check_userpostcheckstatus_id_user_post_check_status_id_fk" FOREIGN KEY ("userpostcheckstatus_id") REFERENCES "public"."user_post_check_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "public_profile_post_mm" ADD CONSTRAINT "public_profile_post_mm_public_profile_id_public_profile_id_fk" FOREIGN KEY ("public_profile_id") REFERENCES "public"."public_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "public_profile_post_mm_post" ADD CONSTRAINT "public_profile_post_mm_post_publicprofilepostmm_id_public_profile_post_mm_id_fk" FOREIGN KEY ("publicprofilepostmm_id") REFERENCES "public"."public_profile_post_mm"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "public_profile_post_mm_post" ADD CONSTRAINT "public_profile_post_mm_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_post_check_status" ADD CONSTRAINT "user_post_check_status_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_post_check_status" ADD CONSTRAINT "user_post_check_status_user_id_user_to_check_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_to_check"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_group_name_a6ea08ec_like" ON "auth_group" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_permission_content_type_id_2f476e4b" ON "auth_permission" USING btree ("content_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_user_username_6821ab7c_like" ON "auth_user" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_user_groups_group_id_97559544" ON "auth_user_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_user_groups_user_id_6a12ed8b" ON "auth_user_groups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_user_user_permissions_permission_id_1fbb5f2c" ON "auth_user_user_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_user_user_permissions_user_id_a95ead1b" ON "auth_user_user_permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log" USING btree ("content_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_admin_log_user_id_c564eba6" ON "django_admin_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_session_expire_date_a5c62663" ON "django_session" USING btree ("expire_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "django_session_session_key_c0390e0f_like" ON "django_session" USING btree ("session_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_post_post_code_de1d3bbc_like" ON "post" USING btree ("post_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_postusertocheckmm_post_id_f2e4d0f9" ON "post_user_to_check_mm" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_postusertocheckmm_postusertocheckmm_id_f15bc1da" ON "post_user_to_check_mm_users_to_check" USING btree ("postusertocheckmm_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_postusertocheckmm_userpostcheckstatus_id_2815edc8" ON "post_user_to_check_mm_users_to_check" USING btree ("userpostcheckstatus_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_publicprofile_username_5564a5dc_like" ON "public_profile" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_publicprofilepostmm_public_profile_id_79e25d84" ON "public_profile_post_mm" USING btree ("public_profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_publicprofilepost_publicprofilepostmm_id_60f5545e" ON "public_profile_post_mm_post" USING btree ("publicprofilepostmm_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_publicprofilepostmm_post_post_id_034bf77f" ON "public_profile_post_mm_post" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_userpostcheckstatus_post_id_0d7f30b6" ON "user_post_check_status" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_userpostcheckstatus_user_id_6f23b115" ON "user_post_check_status" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "main_app_usertocheck_username_9d1f98b8_like" ON "user_to_check" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "login" USING btree (lower(email));