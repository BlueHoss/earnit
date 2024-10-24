ALTER TABLE "credit_transaction" ADD COLUMN "mission_action_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_mission_action_id_mission_action_id_fk" FOREIGN KEY ("mission_action_id") REFERENCES "public"."mission_action"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
