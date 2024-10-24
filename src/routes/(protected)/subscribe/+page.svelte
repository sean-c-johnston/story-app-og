<script lang="ts">
  const lookupKey = "standard_monthly";
</script>

<form action="?/createCheckoutSession" method="POST">
  <!-- Add a hidden field with the lookup_key of your Price -->
  <input type="hidden" name="lookup_key" value={lookupKey} />
  <button id="checkout-and-portal-button" type="submit">Checkout</button>
</form>