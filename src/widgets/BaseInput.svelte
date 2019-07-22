<script>
  export let value
  export let readonly
  export let disabled
  export let inputProps = {}
</script>

<input
  readOnly={readonly}
  {disabled}
  {...inputProps}
  value={value === null ? '' : value}
/>