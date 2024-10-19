<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();
	const story = $derived(data.story);

	let storyPanel: HTMLElement;

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		story;
		storyPanel?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
	});
</script>


<div class="flex flex-col h-full py-4 justify-between items-center">
	<div class="relative h-3/5 w-5/6">
		<div class="flex flex-col items-center w-full h-full overflow-scroll py-20" bind:this={storyPanel}>
			{#each data.story as storySegment}
				<div
					class="{storySegment.type === 'section' ? 'card bg-secondary' : 'card bg-base-300'} p-4 my-2 text-center prose">
					<p>{storySegment.text}</p>
				</div>
			{/each}
		</div>
		<div class="bg-gradient-to-b from-base-100 to-transparent absolute top-0 w-full py-8 click-through"></div>
		<div class="bg-gradient-to-t from-base-100 to-transparent absolute bottom-0 w-full py-8 click-through"></div>
	</div>

	<form action="?/add" method="post" use:enhance>
		<div class="flex flex-col mt-8">
			{#if story.length === 0}
				<button class="btn my-2" type="submit" name="chosenQuestion" value="Tell me a story">Tell me a story!</button>
			{/if}
			{#each data.questions as question}
				<button class="btn my-2" type="submit" name="chosenQuestion" value={question}>{question}</button>
			{/each}
		</div>
	</form>
	<form action="?/clear" method="post" use:enhance>
		<button class="btn btn-warning" type="submit">Clear</button>
	</form>
	<form action="?/logout" method="post">
		<div class="flex flex-row justify-end w-full">
			<button class="btn btn-error" type="submit">Sign out</button>
		</div>
</div>
