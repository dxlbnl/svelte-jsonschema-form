<script>
  export let label
  export let required = false
  export let id
</script>

<label htmlFor={id}>
  {#if required}
    *
  {/if}
  {label}
</label>