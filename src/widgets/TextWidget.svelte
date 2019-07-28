<script>
  import BaseInput from './BaseInput.svelte'

  export let schema
  export let id
  export let label
  export let value
  export let required
  export let readonly
  export let disabled

  $: if (value === undefined) {
    value = ''
  }
</script>

<BaseInput
  bind:value
  {schema}
  {readonly} {disabled}
/>
