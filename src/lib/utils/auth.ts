import type { User } from '$lib/server/database/schema';
export function getUserRole(user: User | null) {
	if (!user) return 'public';
	if (user.is_creator) return 'creator';
	if (user.is_follower) return 'follower';
}
