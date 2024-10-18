<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();

	console.log(data);
</script>

<div class="container mx-auto w-dvw h-dvh">
	<div class="flex flex-col h-full py-4 items-center">
		<div class="relative h-3/5 w-5/6">
			<div class="flex flex-col items-center w-full h-full overflow-scroll py-20">
				{#each data.chapters as chapter}
					<div class="card bg-secondary p-4 my-6 text-center prose">
						<p>{chapter.text}</p>
					</div>
				{/each}
			</div>
			<div class="bg-gradient-to-b from-base-100 to-transparent absolute top-0 w-full py-16 click-through"></div>
			<div class="bg-gradient-to-t from-base-100 to-transparent absolute bottom-0 w-full py-16 click-through"></div>
		</div>

		<form action="?/add" method="post" use:enhance>
			<div class="flex flex-col mt-8">
				{#each data.questions as question, i}
					<button class="btn my-2" type="submit" value={i}>{question}</button>
				{/each}
			</div>
		</form>
	</div>
</div>
