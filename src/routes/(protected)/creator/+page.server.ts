import type { PageServerLoad } from './$types';
import type { CreatorDashboard } from '$lib/types';

import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const subscriberCount = await CreatorDashboardService.getPaidSubscribers(locals.user.id);
	const revenue = await CreatorDashboardService.getMonthlyRevenue(locals.user.id);

	//Sliding 30 day window
	// Get today's date
	const endDate = new Date();
	// Get the date 30 days ago
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);

	const rewardsUsed = await CreatorDashboardService.getRewardsUsed(
		locals.user.id,
		startDate,
		endDate
	);
	const purchaseCount = await CreatorDashboardService.getProductsPurchasedCount(
		locals.user.id,
		startDate,
		endDate
	);
	const purchaseAmount = await CreatorDashboardService.getProductsPurchasedAmount(
		locals.user.id,
		startDate,
		endDate
	);
	const productPurchaseList = await CreatorDashboardService.getProductsPurchasedList(
		locals.user.id,
		startDate,
		endDate
	);
	const followerCount = await CreatorDashboardService.getCreatorFollowerCount(locals.user.id);

	const creatorDashboard: CreatorDashboard = {
		subscriberCount,
		revenue,
		rewardsUsed,
		purchaseCount,
		purchaseAmount,
		productPurchaseList,
		followerCount
	};

	return {
		creatorDashboard
	};
};
