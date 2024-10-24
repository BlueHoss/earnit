ALTER TABLE "credit_transaction" DROP CONSTRAINT "credit_transaction_credit_follower_distribution_id_credit_follower_distribution_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_credit_follower_distribution_id_credit_follower_distribution_id_fk" FOREIGN KEY ("credit_follower_distribution_id") REFERENCES "public"."credit_follower_distribution"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
