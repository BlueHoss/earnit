CREATE INDEX IF NOT EXISTS "idx_creator_credit_pool_creator_id" ON "creator_credit_pool" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_creator_id" ON "credit_transaction" USING btree ("creator_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_follower_id" ON "credit_transaction" USING btree ("follower_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_follower_credit_balance_follower_id" ON "follower_credit_balance" USING btree ("follower_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_follower_credit_balance_creator_id" ON "follower_credit_balance" USING btree ("creator_user_id");