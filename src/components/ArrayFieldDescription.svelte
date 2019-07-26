<script>
  import DescriptionField from '../fields/DescriptionField.svelte'

  export let idSchema

  $: id = `${idSchema.$id}__description`
</script>

<DescriptionField {id}>
  <slot />
</DescriptionField>
