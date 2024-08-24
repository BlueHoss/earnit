ALTER TABLE "auth_session" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "plan" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plan" ALTER COLUMN "plan_percent" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plan" ADD COLUMN "plan_cost" numeric;--> statement-breakpoint
ALTER TABLE "login" ADD CONSTRAINT "login_email_unique" UNIQUE("email");