import { LoggerService } from './logger.service.server';
import { PlanRepository } from '../repositories/plan.repository.server';
import type { Plan } from '$lib/schema/plan.schema';
import { MissionRepository } from '../repositories/mission.repository.server';
import type { Mission, MissionAction } from '$lib/schema/mission.schema';
import { CreditService } from './credit.service.server';
import { CreatorRepository } from '../repositories/creator.repository.server';
import { ScannerRepository } from '../repositories/scanner.repository.server';
import { FollowerRepository } from '../repositories/follower.repository.server';
import { UserRepository } from '../repositories/user.repository.server';
import { type FollowerActionInsert } from '$lib/schema/follower_action.schema';
import {
	FOLLOWER_ACTION_STATUS,
	FollowerActionRepository
} from '$lib/server/repositories/follower-action.repository.server';
import { CreditTransactionRepository } from '$lib/server/repositories/credit-transaction.repository.server';
import type { UserPostCheckStatus } from '$lib/schema/scanner/userPostCheckStatus.schema';
import { DateUtility } from '$lib/utilities/date-utilities';
import { RewardDistrubutionRepository } from '../repositories/reward-distribution.repository.server';

export type DistributionPlatform = 'instagram'; //add others when ready. | 'facebook' | 'threads' | 'etc';

export class DistributionService {
	private readonly platform: string;
	private _mission: Mission | null = null;
	private static readonly cachedPlans: Plan[] = [];

	constructor(platform: DistributionPlatform) {
		this.platform = platform;
	}

	private async getMission(): Promise<Mission | null> {
		if (this._mission) {
			return this._mission;
		}

		this._mission = await MissionRepository.getMissionByName(this.platform);

		return this._mission;
	}

	private async getDatesToProcess(): Promise<Date[]> {
		//Get max date from last run and make that start and end date for this run. No reason to worry about time zones.
		//This will be used to process all the actions for the day.

		const startDate = await RewardDistrubutionRepository.getLastRunDate();
		const dates: Date[] = [];
		const end = new Date(); // today
		const start = new Date(startDate);

		// Reset hours to midnight UTC
		start.setUTCHours(0, 0, 0, 0);
		end.setUTCHours(0, 0, 0, 0);

		// Loop through dates and add to array
		const current = new Date(start);
		while (current <= end) {
			dates.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}

		return dates;
	}

	/**
	 * Goes through the follower_action table. Query to remove dups (hence group by).
	 * Adds up the credits for each follower and insert into the reward_distribution table.
	 * Removes the follower_action records if successful.
	 * @param date this should be UTC date
	 */
	public async processUserPostCheckStatus() {
		const datesToProcess = await this.getDatesToProcess();

		for (let i = 0; i < datesToProcess.length; i++) {
			await this.processUserPostCheckStatusForDate(datesToProcess[i]);
		}
	}

	private async processUserPostCheckStatusForDate(date: Date) {
		const distribution = await RewardDistrubutionRepository.createNewDistrubtion(date);

		if (distribution === null) {
			LoggerService.error(
				'Could not create a new distribution record, credit distribution stopped.'
			);
			return;
		}

		//Can possibly pass in Date if we need to check or reward other days. Right now this is just for today.
		const uniquePendingActions = await FollowerActionRepository.getFollowerActions(date);

		//Process action - because of grouping in uniquePendingActions we trust that the credits are not being duplicated.
		//But there is one more check to make sure. If the follower has already been awarded for this action.
		for (let i = 0; i < uniquePendingActions.length; i++) {
			const action = uniquePendingActions[i];

			const exists = await CreditTransactionRepository.pendingTransactionExists(
				action.creator_user_id,
				action.follower_user_id,
				action.mission_action_id,
				date
			);

			if (!exists) {
				//Award credits
				const creditReward = await this.calculateFollowerCredits(
					action.follower_user_id,
					action.creator_user_id,
					Number(action.credits)
				);

				if (creditReward === 0) {
					LoggerService.error(
						`No active plan subscriptions found for Follower ${action.follower_user_id} and Creator ${action.creator_user_id}. No credits will be awarded.`,
						'Reward distribution will not distribute 0 credits',
						'processUserPostCheckStatus'
					);
					continue;
				}

				const result = await CreditService.makeFollowerDeposit(
					action.creator_user_id,
					action.follower_user_id,
					creditReward,
					action.mission_action_id
				);

				if (result.success) {
					//Delte record from action table
					await FollowerActionRepository.deleteProcessedAction(action);
				} else {
					action.status = FOLLOWER_ACTION_STATUS.Failed;
					action.error_message = result.message
						? result.message
						: 'An error occurred while processing the action.';
					//Set the action status to error and add the error message.
					await FollowerActionRepository.updateAction(action);
				}
			}
		}

		await RewardDistrubutionRepository.updateDistributionStatus(
			distribution.id!,
			'completed',
			uniquePendingActions.length
		);
	}

	private async calculateFollowerCredits(
		followerUserId: number,
		creatorUserId: number,
		possibleCredits: number
	): Promise<number> {
		//get the plan subscription to determin how much of the rewards to distribute
		const planSubscriptions = await PlanRepository.getActivePlanSubscriptionsWithPercentage(
			creatorUserId,
			followerUserId
		);

		if (planSubscriptions.length === 0) {
			return 0;
		}
		//Grab the plan with the highest percentage
		const sub = planSubscriptions[0];

		const reward = Math.round((possibleCredits * Number(sub.plan_percent)) / 100);
		return reward;
	}

	public async consumeUserPostChechChange(userPostStatus) {
		const mission = await this.getMission();

		if (!userPostStatus) {
			LoggerService.error('Could not find user post status, exit without awarding credits');
			return null;
		} else if (userPostStatus.new) {
			userPostStatus = userPostStatus.new;
		} else {
			LoggerService.error(
				'Could not find the "new" user post status, exit without awarding credits'
			);
			return null;
		}

		if (!mission) {
			LoggerService.error('Could not find mission to award credits, exit without awarding credits');
			return null;
		}

		const followerId = await this.getFollowerId(userPostStatus.user_id);
		if (!followerId) {
			LoggerService.error('Could not find Earn it follower to award credits');
			return null;
		}

		const creatorId = await this.getCreatorId(userPostStatus.post_id);
		if (!creatorId) {
			LoggerService.error('Could not find Earn it creator to award credits');
			return null;
		}

		await this.setActionsFromUserPostStatus(userPostStatus, mission, followerId, creatorId);

		await this.processUserPostCheckStatus();
	}

	private async setActionsFromUserPostStatus(
		userPostStatus: UserPostCheckStatus,
		mission: Mission,
		followerId: number,
		creatorId: number
	) {
		const missionActions = await MissionRepository.getMissionActions(mission.id!, creatorId);

		for (let i = 0; i < missionActions.length; i++) {
			const missionAction = missionActions[i];
			let currentAction: MissionAction | null = null;
			if (userPostStatus.liker) {
				if (missionAction.lookup_name === 'like') {
					currentAction = missionAction;
				}
			}

			if (userPostStatus.commenter) {
				if (missionAction.lookup_name === 'comment') {
					currentAction = missionAction;
				}
			}

			if (userPostStatus.follower && userPostStatus.checked) {
				if (missionAction.lookup_name === 'follow') {
					currentAction = missionAction;
				}
			}

			if (!currentAction) continue;

			const followerAction: FollowerActionInsert = {
				creator_user_id: creatorId,
				follower_user_id: followerId,
				mission_action_id: currentAction.id,
				credits: currentAction.reward_per_day.toString(),
				status: FOLLOWER_ACTION_STATUS.Pending,
				date_added: new Date().toUTCString()
			};

			FollowerActionRepository.insertFollowerAction(followerAction);
		}
	}

	private async getCreatorId(postId: number): Promise<number | null> {
		const scanCreator = await ScannerRepository.getScanCreatorByPost(postId);
		if (!scanCreator) return null;

		const creatorId = await CreatorRepository.getCreatorIDByScannerId(scanCreator.id!);
		if (creatorId) return creatorId;

		const earnItCreator = await UserRepository.getUserBySocialMediaProfile(scanCreator.username);
		if (!earnItCreator) return null;

		await CreatorRepository.mapEarnItScanCreator(scanCreator.id!, earnItCreator.id!);
		return earnItCreator.id!;
	}

	private async getFollowerId(userId: number): Promise<number | null> {
		const followerId = await FollowerRepository.getFollowerIDByScannerId(userId);
		if (followerId) return followerId;

		const scanUser = await ScannerRepository.getUserToCheck(userId);
		if (!scanUser) return null;

		const follower = await UserRepository.getUserBySocialMediaProfile(scanUser.username);
		if (!follower) return null;

		const addEarnItFollower = await FollowerRepository.mapEarnItScanFollower(userId, follower.id!);
		return addEarnItFollower ? follower.id! : null;
	}
}
