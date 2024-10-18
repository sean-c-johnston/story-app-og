<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();

	console.log(data);
</script>

<div class="container mx-auto w-dvw h-dvh">
	<div class="flex flex-col h-full py-4 items-center">
		<div class="relative h-3/5 w-3/5">
			<div class="flex flex-col w-full h-full overflow-scroll">
				{#each data.chapters as chapter}
					<div class="card bg-secondary p-2 my-4 w-full text-center">
						<p>{chapter.text}</p>
					</div>
				{/each}
			</div>
			<div class="bg-gradient-to-t from-base-100 to-transparent absolute bottom-0 w-full py-16 click-through"></div>
		</div>

		<br />

		<form action="?/add" method="post" use:enhance>
			<div class="flex flex-col">
				{#each data.questions as question, i}
					<button class="btn my-2" type="submit" value={i}>{question}</button>
				{/each}
			</div>
		</form>
	</div>
</div>
