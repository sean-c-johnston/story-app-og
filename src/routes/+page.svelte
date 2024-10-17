<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();

	console.log(data);
</script>

<div>
	{#each data.chapters as chapter}
		<p>{chapter.text}</p>
	{/each}

	<br />

	<form action="?/add" method="post" use:enhance>
		<button class="btn" type="submit" value="1">Choose Option 1</button>
		<button class="btn" type="submit" value="2">Choose Option 2</button>
		<button class="btn" type="submit" value="3">Choose Option 3</button>
	</form>
</div>
