<script>
  import BaseInput from './BaseInput.svelte'
  export let value
  export let readonly
  export let disabled
  export let autofocus
  export let inputProps = {}

  export let registry
</script>

<BaseInput
  bind:value
  {readonly} {disabled}
  {...inputProps}
/>
