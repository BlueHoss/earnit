import { CreatorDashboardService } from '$lib/server/services/creator.dashboard.service.server.js';
import { FollowersDashboardService } from '$lib/server/services/follower.dashboard.service.server.js';
import { PlanService } from '$lib/server/services/plan.service.server.js';
import { ProductService } from '$lib/server/services/product.service.server.js';
import { UserService } from '$lib/server/services/user.service.server.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
	const creatorId = Number(params.creatorId);

	if (!creatorId) {
		return error(404, 'Not found');
	} else if (isNaN(creatorId)) {
		return error(404, 'Not found');
	}

	//Get the creator and return
	const creator = await UserService.getSessioUser(creatorId);
	const products = await ProductService.getProductsByUserId(creatorId);
	const missionActions = await CreatorDashboardService.getMissionActionList(creatorId);

	let followerCredits = 0;
	let followerPurchases = 0;
	let followerPlan = null;

	if (locals.user) {
		followerCredits = await FollowersDashboardService.getFollowerCreditsByCreator(
			locals.user.id,
			creatorId
		);
		followerPurchases = await FollowersDashboardService.getFollowerProductsPurchasedFromCreator(
			locals.user.id,
			creatorId
		);
		followerPlan = await PlanService.getSubscriberPlan(locals.user.id, creatorId);
	}
	if (!creator) {
		return error(404, 'Not found');
	}

	return {
		creator,
		products,
		missionActions,
		followerCredits,
		followerPurchases,
		followerPlan
	};
}
