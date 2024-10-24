import { DistributionService } from '$lib/server/services/distribution.service.server';
import { LoggerService } from '$lib/server/services/logger.service.server';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		//await DistributionService.runCreatorDistribution();

		//await DistributionService.runFollowerDistribution();

		return json({ success: true, message: 'Rewards cron ran successfully' });
	} catch (error) {
		LoggerService.handleError(
			error,
			`Distribute rewards failed`,
			'/api/cron/distribute-rewards/ runFollowerDistribution'
		);

		return json({ success: false, message: 'Failed to distribute rewards' }, { status: 500 });
	}
}
