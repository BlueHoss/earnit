import { PRIVATE_DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const pool = new pg.Pool({
	connectionString: PRIVATE_DATABASE_URL
});

await pool.connect();
const db = drizzle(pool, {
	// logger: {
	// 	logQuery: (query: string, params: unknown[]) => {
	// 		console.log('Query:', query);
	// 		console.log('Parameters:', params);
	// 	}
	// }
});

export default db;
