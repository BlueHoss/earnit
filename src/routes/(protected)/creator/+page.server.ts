import type { PageServerLoad } from './$types';
import type { CreatorDashboard } from '$lib/types';

import {
	getPaidSubscribers,
	getMonthlyRevenue,
	getRewardsUsed,
	getProductsPurchasedCount,
	getProductsPurchasedAmount,
	getProductsPurchasedList
} from '$lib/server/services/follower-dashboard-service';

export const load: PageServerLoad = async ({ locals }) => {
	const subscriberCount = await getPaidSubscribers(locals.user.id);
	const revenue = await getMonthlyRevenue(locals.user.id);

	const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

	const rewardsUsed = await getRewardsUsed(locals.user.id, startDate, endDate);
	const purchaseCount = await getProductsPurchasedCount(locals.user.id, startDate, endDate);
	const purchaseAmount = await getProductsPurchasedAmount(locals.user.id, startDate, endDate);
	const productPurchaseList = await getProductsPurchasedList(locals.user.id, startDate, endDate);

	const creatorDashboard: CreatorDashboard = {
		subscriberCount,
		revenue,
		rewardsUsed,
		purchaseCount,
		purchaseAmount,
		productPurchaseList
	};

	return {
		creatorDashboard
	};
};
