<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import HeartIcon from 'lucide-svelte/icons/heart';
	import ShareIcon from 'lucide-svelte/icons/share';
	import CirclePlusIcon from 'lucide-svelte/icons/circle-plus';
	import FilmIcon from 'lucide-svelte/icons/film';
	import CommentIcon from 'lucide-svelte/icons/message-square-more';
	import FollowIcon from 'lucide-svelte/icons/user-round-check';
	import type { DefaultMission } from '$lib/schema/mission.schema';

	export let mission: DefaultMission;

	function setIcon(name: string) {
		if (!name) return CirclePlusIcon;
		name = name.toLowerCase();

		if (name.includes('follow')) {
			return FollowIcon;
		} else if (name.includes('comment')) {
			return CommentIcon;
		} else if (name.includes('like')) {
			return HeartIcon;
		} else if (name.includes('watch')) {
			return FilmIcon;
		} else {
			return CirclePlusIcon;
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{mission.name} Merit Missions</Card.Title>
		<Card.Description>{mission.description}</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-8">
		{#each mission.actions as action}
			<div class="flex items-center gap-4">
				<svelte:component this={setIcon(action.icon)} />
				<div class="grid gap-1">
					<p class="text-sm font-medium leading-none">{action.name}</p>
					<p class="text-sm text-muted-foreground">{action.description}</p>
				</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>

<!-- <Card.Root> 
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
</Card.Root> -->
