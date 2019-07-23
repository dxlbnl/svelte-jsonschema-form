<script>
  import BaseInput from './BaseInput.svelte'

  export let schema
  export let id
  export let label
  export let value
  export let required
  export let readonly
  export let disabled
</script>

<BaseInput
  bind:value
  {schema}
  {readonly} {disabled}
/>
