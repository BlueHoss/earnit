import type { PageServerLoad } from './$types';
import type { CreatorDashboardPublic } from '$lib/types';

import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server';
import { ProductService } from '$lib/server/services/product.service.server';

export const load: PageServerLoad = async ({ locals }) => {
	const subscriberCount = await CreatorDashboardService.getPaidSubscribers(locals.user.id);

	const purchaseCount = await CreatorDashboardService.getProductsPurchasedCount(
		locals.user.id,
		null,
		null
	);

	const products = await ProductService.getProductsByUserId(locals.user.id);

	const followerCount = await CreatorDashboardService.getCreatorFollowerCount(locals.user.id);

	const productCount = await CreatorDashboardService.getProductCount(locals.user.id);

	const creatorDashboard: CreatorDashboardPublic = {
		subscriberCount,
		purchaseCount,
		followerCount,
		productCount,
		products
	};

	return {
		creatorDashboard
	};
};
