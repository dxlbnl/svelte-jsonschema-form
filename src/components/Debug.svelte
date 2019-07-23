<script context=module>
  import { writable } from 'svelte/store'
  export const showDebug = writable(false) 
</script>

<script>
  export let data
  export let title = 'data'
</script>

<style>
  pre {
    display: inline-block;
    margin: 0.5rem;
    padding: 0.5rem;
    border: thin solid var(--debug-color, blue);
    border-radius: 0.5rem;
    font-size: 0.5rem;
  }
</style>

{#if data && $showDebug}
  <pre>
    {title} = {JSON.stringify(data, null, 2)}
  </pre>
{/if}
