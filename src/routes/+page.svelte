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
			<div class="bg-gradient-to-t from-base-100 to-transparent absolute bottom-0 w-full py-16"></div>
		</div>

		<br />

		<form action="?/add" method="post" use:enhance>
			<div class="flex flex-col">
				<button class="btn my-2" type="submit" value="1">Choose Option 1</button>
				<button class="btn my-2" type="submit" value="2">Choose Option 2</button>
				<button class="btn my-2" type="submit" value="3">Choose Option 3</button>
			</div>
		</form>
	</div>
</div>
