// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/database/schema.ts',
	out: './src/lib/server/database/migrations',
	dbCredentials: {
		database: process.env.PRIVATE_DB_DATABASE,
		host: process.env.PRIVATE_DB_HOST,
		password: process.env.PRIVATE_DB_PASSWORD,
		user: process.env.PRIVATE_DB_USER,
		port: process.env.PRIVATE_DB_PORT,
		ssl: false
	}
});
