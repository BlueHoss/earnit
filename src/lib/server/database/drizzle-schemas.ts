import { authSessionTable, authUserTable } from './migrations/schema';

export type User = typeof authUserTable.$inferInsert;
export type UpdateUser = Partial<typeof authUserTable.$inferInsert>;
export type Session = typeof authSessionTable.$inferInsert;
