<script>
  export let help
</script>

{#if help}
  {#if typeof help === 'string'}
    <p>{help}</p>
  {:else}
    <div>{help}</div>
  {/if}
{/if}
