<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

	export let form: ActionData;

	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<div class="flex flex-col h-full py-40 items-center">
	<form class="flex flex-col justify-between items-center h-1/3" method="POST" use:enhance={handleSubmit}>
		<h1 class="text-xl">Sign up or log in using just your email.</h1>

		{#if form?.message !== undefined}
			<div class="{form?.success ? 'text-success' : 'text-error'}">
				{form?.message}
			</div>
		{/if}

		<input
			id="email"
			name="email"
			class="input input-bordered w-full"
			type="email"
			placeholder="Your email"
			value={form?.email ?? ''}
		/>

		{#if !form?.errors?.email}
				<span class="flex items-center text-sm error">
					{form?.errors?.email}
				</span>
		{/if}

		<button class="btn btn-primary">
			{ loading ? 'Loading' : 'Send magic link' }
		</button>
	</form>
</div>