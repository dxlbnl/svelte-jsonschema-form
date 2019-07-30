<script context=module>
  import { writable } from 'svelte/store'
  export const showDebug = writable(false) 
</script>

<script>
  export let data
  export let title = 'data'
  let expanded
</script>

<style>
  section {
    display: flex;
    flex-flow: column;
    background: #e3e3e3;
  }
  button {
    font-size: 0.6rem
    
  }
  pre {
    display: inline-block;
    padding: 0.5rem;
    font-size: 0.5rem;

    max-height: 30rem;
    overflow: scroll;
  }

</style>

{#if data && $showDebug}
  <section>
    <button type=button on:click={() => expanded = !expanded}>
      {title}
      {#if expanded}
        -
      {:else}
        +
      {/if}
    </button>
    {#if expanded}
      <pre class:expanded>
        {JSON.stringify(data, null, 2)}
      </pre>
    {/if}
  </section>
{/if}
