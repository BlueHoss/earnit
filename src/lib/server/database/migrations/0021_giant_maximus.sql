DROP TABLE "reward_distribution_detail";--> statement-breakpoint
ALTER TABLE "mission" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mission" ALTER COLUMN "platform" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD COLUMN "reward_distribution_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_reward_distribution_id_reward_distribution_id_fk" FOREIGN KEY ("reward_distribution_id") REFERENCES "public"."reward_distribution"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
