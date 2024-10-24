import { sql, type SQL } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

function removeAllSpaces(text: string): string {
	return !text ? '' : text.replace(/\s/g, '');
}

/**
 * postgres function to convert text fields to lowercase
 * @param email
 * @returns SQL
 */
function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
}

export const TextUtilities = {
	removeAllSpaces,
	lower
};
