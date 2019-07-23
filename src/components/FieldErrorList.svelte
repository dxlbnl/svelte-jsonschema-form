<script>
  export let errors = []
</script>

{#if errors.length === 0}
  <div>
    <ul>
      {#each errors as error}
        <li>
          {error}
        </li>
      {/each}
    </ul>
  </div>
{/if}