<script>
  import DescriptionField from '../fields/DescriptionField.svelte'

  export let idSchema
  export let description

  $: id = `${idSchema.$id}__description`
</script>

{#if description}
<DescriptionField {id}>
  {description}
</DescriptionField>
{/if}
