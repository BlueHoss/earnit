ALTER TABLE "reward_earned" DROP CONSTRAINT "reward_earned_action_id_reward_action_id_fk";
--> statement-breakpoint
ALTER TABLE "reward_earned" DROP COLUMN IF EXISTS "action_id";