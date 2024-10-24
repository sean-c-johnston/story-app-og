<script lang="ts">
	import { page } from "$app/stores";

  const session_id = $page.url.searchParams.get("session_id");
</script>

<h1 class="text-3xl">Success</h1>

<form action="?/createPortalSession" method="POST">
  <input type="hidden" id="session-id" name="session_id" value={session_id} />
  <button id="checkout-and-portal-button" type="submit">Manage your billing information</button>
</form>