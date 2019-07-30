<script>
  import { createEventDispatcher } from 'svelte';
  import { getContext } from 'svelte'

  import {
    retrieveSchema, toIdSchema
  } from '../util'

  import ArrayFieldTitle from './ArrayFieldTitle.svelte'
  import ArrayFieldDescription from './ArrayFieldDescription.svelte'
  import ArrayItem from './ArrayItem.svelte'
  import AddButton from './AddButton.svelte'

  const dispatch = createEventDispatcher()

  export let formData

  export let schema
  export let idSchema
  export let uiSchema
  export let errorSchema = undefined

  export let title

  export let readonly
  export let disabled 
  export let required

  let className = ''
  export { className as class }
  export let items

  let canAdd = true

  const registry = getContext('registry')
  const { definitions } = registry

  $: description = uiSchema["ui:description"] || schema.description

  $: items = formData.map((item, index) => {
    const itemsSchema = retrieveSchema(schema.items, definitions);
    const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
    const itemIdPrefix = idSchema.$id + "_" + index;
    const itemIdSchema = toIdSchema(itemsSchema, itemIdPrefix, definitions);
    return {
      index,
      canMoveUp: index > 0,
      canMoveDown: index < formData.length - 1,
      schema: itemsSchema,
      idSchema: itemIdSchema,
      errorSchema: itemErrorSchema,
      uiSchema,
      itemUiSchema: uiSchema.items,
      disabled, readonly
    }
  })
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
        <ArrayItem
          on:delete-item
          on:reorder-item
          bind:itemData={formData[item.index]}
          {...item}
        />
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