import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { DistributionService } from '$lib/server/services/distribution.service.server';

// Initialize Supabase client with service role key
const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE_KEY, {
	db: { schema: 'public' }
});

export function initSupabaseListener() {
	const channel = supabase
		.channel('db-changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'user_post_check_status'
			},
			(payload) => {
				//console.log('Change received!', payload);
				//Big assumption that this is for Instagram... need to refactor once new social media platforms are added
				const distributionService = new DistributionService('instagram');
				distributionService.consumeUserPostChechChange(payload);
				// Handle the change event here
				// You can emit events, update server-side state, or perform any other action
			}
		)
		.subscribe((status) => {
			if (status === 'SUBSCRIBED') {
				console.log('Supabase listener is now connected and listening for changes.');
				const dist = new DistributionService('instagram');
				dist.processUserPostCheckStatus();
			}
		});

	return () => {
		console.log('Supabase listener is disconnected.');
		channel.unsubscribe();
	};
}
