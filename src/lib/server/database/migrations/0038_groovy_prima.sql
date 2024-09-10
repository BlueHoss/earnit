ALTER TABLE "mission_creator" ADD COLUMN "enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "mission" DROP COLUMN IF EXISTS "enabled";