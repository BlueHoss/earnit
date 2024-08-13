// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/database/drizzle-schemas.ts',
	out: './src/lib/server/database/migrations',
	dbCredentials: {
		database: 'postgres',
		host: 'aws-0-us-west-1.pooler.supabase.com',
		password: 'krw!cfh9NHF@zxn5rtu',
		user: 'postgres.aypbxyydasoahfpgqwez',
		port: 6543,
		ssl: false
	}
});
