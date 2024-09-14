<!-- src/routes/creator-catalog/CreatorCard.svelte -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import AvatarImage from '$lib/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '$lib/components/ui/avatar/avatar-fallback.svelte';

	export let creator;
</script>

<Card.Root class="overflow-hidden">
	<Card.Header class="p-0">
		<img
			src={creator.profile_pic || '/default-profile.jpg'}
			alt={creator.store_name || 'Creator'}
			class="w-full h-48 object-cover"
		/>
	</Card.Header>
	<Card.Content class="p-4">
		<div class="flex items-center mb-2">
			<Avatar class="w-10 h-10 mr-2">
				<AvatarImage
					src={creator.profile_pic || '/default-profile.jpg'}
					alt={creator.store_name || 'Creator'}
				/>
				<AvatarFallback>{(creator.store_name || 'C')[0]}</AvatarFallback>
			</Avatar>
			<div>
				<h3 class="text-lg font-semibold">{creator.store_name || 'Unnamed Store'}</h3>
				<p class="text-sm text-muted-foreground">@{creator.handle || 'nohandle'}</p>
			</div>
		</div>
		<p class="text-sm mb-4">{creator.title || 'No title'}</p>
		<p class="text-xs text-muted-foreground mb-4">
			Category: {creator.category || 'Uncategorized'}
		</p>
		<Button variant="outline" href="/public/market/{creator.id}" class="w-full">View Store</Button>
	</Card.Content>
</Card.Root>
