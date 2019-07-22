<script>
  export let schema
  export let idSchema
  export let reason
</script>

<div class="unsupported-field">
  <p>
    Unsupported field schema
    {#if idSchema && idSchema.$id} (
      <span>
        for field <code>{idSchema.$id}</code>
      </span>
    )
    {/if}
    {#if reason}
      <em>: {reason}</em>.
    {/if}
  </p>
  {#if schema}
    <pre>{JSON.stringify(schema, null, 2)}</pre>
  {/if}
</div>

<style>
  .unsupported-field p {
    font-weight: bold;
  }
  .unsupported-field span {
    font-weight: normal;
  }
  pre {
    font-size: 0.8rem;
    color: white;
    background: black;

    display: inline-block;
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>