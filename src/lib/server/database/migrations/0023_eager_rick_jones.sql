ALTER TABLE "reward_action" RENAME TO "mission_action";--> statement-breakpoint
ALTER TABLE "mission_action" DROP CONSTRAINT "reward_action_mission_id_mission_id_fk";
--> statement-breakpoint
ALTER TABLE "mission_action" DROP CONSTRAINT "reward_action_creator_user_id_login_id_fk";
--> statement-breakpoint
ALTER TABLE "reward_earned" DROP CONSTRAINT "reward_earned_reward_type_id_reward_action_id_fk";
--> statement-breakpoint
ALTER TABLE "product_item" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_action" ADD CONSTRAINT "mission_action_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mission_action" ADD CONSTRAINT "mission_action_creator_user_id_login_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."login"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reward_earned" ADD CONSTRAINT "reward_earned_reward_type_id_mission_action_id_fk" FOREIGN KEY ("reward_type_id") REFERENCES "public"."mission_action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
