// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/database/schema.ts',
	out: './src/lib/server/database/migrations',
	dbCredentials: {
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		user: process.env.DB_USER,
		port: process.env.DB_PORT,
		ssl: false
	}
});
