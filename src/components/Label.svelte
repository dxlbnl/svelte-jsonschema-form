<script>
  export let label
  export let required = false
  export let id
</script>

{#if label}
<label htmlFor={id}>
  {#if required}
    *
  {/if}
  {label}
</label>
{/if}