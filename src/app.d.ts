import type { login_table } from '$lib/server/database/schema';
import type { auth_session_table } from '$lib/server/database/schema';
declare global {
	namespace App {
		interface Locals {
			// user: import('lucia').User | null;
			// session: import('lucia').Session | null;
			user: login_table | null;
			session: auth_session_table | null;
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			message: unknown;
			track: unknown;
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
	}
}

export {};
