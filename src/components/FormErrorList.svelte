<script>
  export let errors = []
</script>

{#if errors.length > 0}
  <div class="panel panel-danger errors">
    <div class="panel-heading">
      <h3 class="panel-title">Errors</h3>
    </div>
    <ul class="list-group">
      {#each errors as error}
        <li class="list-group-item text-danger">
          {error.stack}
        </li>
      {/each}
    </ul>
  </div>
{/if}