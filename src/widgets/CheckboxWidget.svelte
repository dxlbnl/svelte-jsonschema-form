<script>
  export let schema

  export let value
  export let id
  export let readonly
  export let disabled
  export let required
  export let inputProps = {}
  export let label
</script>

<div class='checkbox' class:disabled={disabled || readonly}>

  {#if schema.description}
    <!-- <DescriptionField description={schema.description} /> -->
  {/if}
  <label>
    <input
      type="checkbox"
      {id}
      checked={typeof value === "undefined" ? false : value}
      {required}
      disabled={disabled || readonly}
    />
    <span>{label}</span>
  </label>
</div>