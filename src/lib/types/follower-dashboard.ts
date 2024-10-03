import type { FollowerCreditBalanceDetail } from '$lib/schema/credit.schema';
import type { Subsciption } from '$lib/schema/follower_dashboard.schema';
import type { ProductQueryResult } from '$lib/schema/product.schema';
import type { User } from 'lucia';

export interface FollowerDashboard {
	availableCredits: number;
	subscriptionCount: number;
	creditsRedeemed: number;
	subscriberList: Subsciption[];
	productsPurchased: ProductQueryResult[];
	creditBalanceDetails: FollowerCreditBalanceDetail[];
}
export interface FollowerDashboardData {
	user: User;
	dashboard: FollowerDashboard;
}
