ALTER TABLE "plan" ADD COLUMN "level" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_subscription" DROP COLUMN IF EXISTS "level";