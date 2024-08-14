import { auth_session_table, login_table } from './schema';

export type User = typeof login_table.$inferInsert;
export type UpdateUser = Partial<typeof login_table.$inferInsert>;
export type Session = typeof auth_session_table.$inferInsert;
