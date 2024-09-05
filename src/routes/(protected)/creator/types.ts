import type { CreatorDashboard } from '$lib/types/creator-dashabord';
import type { User } from 'lucia';

export interface UserDashboardData {
	user: User;
	dashboard: CreatorDashboard;
}

export interface UserPageData {
	user: User;
}
