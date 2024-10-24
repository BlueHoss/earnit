// import { RewardDistrubutionRepository } from '../repositories/reward-distribution.repository.server';
// import { LoggerService } from './logger.service.server';
// import { PlanRepository } from '../repositories/plan.repository.server';
// import type { Plan, PlanSubscription } from '$lib/schema/plan.schema';
// import { MissionRepository } from '../repositories/mission.repository.server';
// import type { MissionAction } from '$lib/schema/mission.schema';
// import { MissionActionsCache } from '../helpers/missionActionCache';
// import { CreditService } from './credit.service.server';
// import { CreatorRepository } from '../repositories/creator.repository.server';
// import { PRIVATE_EARNIT_DISTRBUTION_USER_ID } from '$env/static/private';
// import { PRIVATE_EARNIT_DISTRBUTION_DEPOSIT_VALUE } from '$env/static/private';

// export class OldDistributionService {
// 	private static readonly cachedPlans: Plan[] = [];
// 	private static readonly cachedMissionActions = new MissionActionsCache();

// 	public async runFollowerDistribution(): Promise<void> {
// 		const lastRun = await RewardDistrubutionRepository.getDistributionByDate(new Date());
// 		if (lastRun.length > 0) {
// 			LoggerService.error('Distribution already ran today');
// 			return;
// 		}

// 		const distribution = await RewardDistrubutionRepository.createNewDistrubtion(new Date());
// 		if (!distribution) {
// 			LoggerService.error('Failed to create distribution');
// 			return;
// 		}

// 		const planSubscriptions = await PlanRepository.getActivePlanSubscriptions();
// 		await this.distribute(distribution.id, planSubscriptions);
// 		await RewardDistrubutionRepository.updateDistributionStatus(distribution.id, 'completed');
// 	}

// 	public static async runCreatorDistribution(): Promise<void> {
// 		const creators = await CreatorRepository.getCreatorsWithSubscriptions();
// 		let balanceUpdateCount = 0;

// 		for (const creator of creators) {
// 			if (creator.credit_balance < 1000 && creator.id !== undefined) {
// 				balanceUpdateCount++;
// 				await CreditService.makeCreatorDeposit(
// 					Number(PRIVATE_EARNIT_DISTRBUTION_USER_ID),
// 					creator.id,
// 					Number(PRIVATE_EARNIT_DISTRBUTION_DEPOSIT_VALUE)
// 				);
// 			}
// 		}

// 		LoggerService.info(
// 			`Updated ${balanceUpdateCount} creator balances on the daily distribution cron job`
// 		);
// 	}

// 	private async distribute(
// 		distributionId: number,
// 		planSubscriptions: PlanSubscription[]
// 	): Promise<void> {
// 		for (const sub of planSubscriptions) {
// 			const plan = await this.getPlan(sub.plan_id);
// 			if (!plan) continue;

// 			const rewardsToDistribute = await this.getCreatorActionRewards(sub.creator_user_id);
// 			const creditsPerFollower = Math.round(
// 				(rewardsToDistribute * Number(plan.plan_percent)) / 100
// 			);

// 			const missionAction = await MissionRepository.getFirstMissionAction(sub.creator_user_id);
// 			if (!missionAction) continue;

// 			await CreditService.makeFollowerDeposit(
// 				sub.creator_user_id,
// 				sub.follower_user_id,
// 				creditsPerFollower,
// 				missionAction.id
// 			);
// 		}
// 	}

// 	private async getPlan(planId: number): Promise<Plan | null> {
// 		const cachedPlan = OldDistributionService.cachedPlans.find((p) => p.id === planId);
// 		if (cachedPlan) return cachedPlan;

// 		const plan = await PlanRepository.getPlanById(planId);
// 		if (plan) {
// 			OldDistributionService.cachedPlans.push(plan);
// 		}
// 		return plan;
// 	}

// 	private async getCreatorActionRewards(creatorId: number): Promise<number> {
// 		const cachedActions = OldDistributionService.cachedMissionActions.get(
// 			this.missionId,
// 			creatorId
// 		);
// 		if (cachedActions) {
// 			return this.sumRewardsPerDay(cachedActions);
// 		}

// 		const actions = await MissionRepository.getMissionActions(this.missionId, creatorId);
// 		if (actions) {
// 			OldDistributionService.cachedMissionActions.set(this.missionId, creatorId, actions);
// 		}
// 		return this.sumRewardsPerDay(actions);
// 	}

// 	private sumRewardsPerDay(rewardActions: MissionAction[]): number {
// 		return rewardActions.reduce((sum, action) => {
// 			const reward = Number(action.reward_per_day);
// 			return sum + (isNaN(reward) ? 0 : reward);
// 		}, 0);
// 	}
// }
