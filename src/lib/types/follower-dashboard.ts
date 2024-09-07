import type { Follower, Subsciption } from '$lib/schema/follower_dashboard.schema';
import type { User } from 'lucia';

export interface FollowerDashboard {
	availableCredits: number;
	subscriptionCount: number;
	followingCount: number;
	creditsRedeemed: number;
	subscriberList: Subsciption[];
	followerList: Follower[];
}
export interface FollowerDashboardData {
	user: User;
	dashboard: FollowerDashboard;
}
