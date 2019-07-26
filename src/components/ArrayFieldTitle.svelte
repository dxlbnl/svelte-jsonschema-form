<script>
  import TitleField from '../fields/TitleField.svelte'

  export let title
  export let idSchema
  export let required

  $: id = `${idSchema.$id}__title`
</script>

{#if title}
  <TitleField {id} {title} {required} />
{/if}