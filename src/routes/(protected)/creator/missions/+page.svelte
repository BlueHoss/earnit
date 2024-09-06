<!-- Page Missions -->
<script>
	import * as Card from '$lib/components/ui/card/index.ts';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share';
	import FilmIcon from 'lucide-svelte/icons/film';
	import CommentIcon from 'lucide-svelte/icons/message-square-more';
	import FollowIcon from 'lucide-svelte/icons/user-round-check';
	import PageWrapper from '$lib/components/base/PageWrapper.svelte';
</script>

<PageWrapper>
	<div>
		<h1 class="mb-2 text-2xl font-semibold">Earn It Merit Missions</h1>

		<Card.Root>
			<Card.Header>
				<Card.Title>Instagram Merit Missions</Card.Title>
				<Card.Description
					>Complete the following missions to earn Merit Credits. For specific credit values please
					navigate to a Creator Profile.</Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-8">
				<div class="flex items-center gap-4">
					<HeartIcon />

					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Like</p>
						<p class="text-sm text-muted-foreground">
							Press the like button on an instragram post.
						</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<CommentIcon />
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Comment</p>
						<p class="text-sm text-muted-foreground">Make a comment on a post</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<FollowIcon />
					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Follow</p>
						<p class="text-sm text-muted-foreground">Follow a creator</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<ShareIcon />

					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Share</p>
						<p class="text-sm text-muted-foreground">Share a post</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<FilmIcon />

					<div class="grid gap-1">
						<p class="text-sm font-medium leading-none">Like a Reel</p>
						<p class="text-sm text-muted-foreground">Like an Instagram Real</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</PageWrapper>
