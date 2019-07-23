<script>
  export let schema
  export let value = ''
  export let readonly
  export let disabled
</script>

<input
  readOnly={readonly}
  {disabled}
  bind:value={value}
/>