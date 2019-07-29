<script>
  import { createEventDispatcher } from 'svelte';

  import ArrayFieldTitle from './ArrayFieldTitle.svelte'
  import ArrayFieldDescription from './ArrayFieldDescription.svelte'
  import ArrayItem from './ArrayItem.svelte'
  import AddButton from './AddButton.svelte'

  const dispatch = createEventDispatcher()

  export let formData

  export let schema
  export let idSchema
  export let uiSchema

  export let title

  export let readonly
  export let disabled 
  export let required

  let className = ''
  export { className as class }
  export let items

  let canAdd = true

  $: description = uiSchema["ui:description"] || schema.description
</script>

<fieldset class={className}>
  <ArrayFieldTitle
    {idSchema}
    title={uiSchema["ui:title"] || title}
    {required}
  />

  <ArrayFieldDescription {idSchema} {description} />

  <div class="row array-item-list">
    {#if items}
      {#each items as item}
        <ArrayItem bind:itemData={formData[item.index]} {...item} />
      {/each}
    {/if}
  </div>

  {#if canAdd}
    <AddButton
      on:click={() => dispatch('add-item')}
      disabled={disabled || readonly}
    />
  {/if}
</fieldset>