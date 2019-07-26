<script>
  import { getContext } from 'svelte'

  import {
    retrieveSchema, toIdSchema, getDefaultFormState,
    isFixedItems, allowAdditionalItems
  } from '../util'
  import ArrayFieldTemplate from '../components/ArrayFieldTemplate.svelte'
  import Debug from '../components/Debug.svelte'

  export let schema
  export let uiSchema = {}
  export let errorSchema = undefined
  export let idSchema = {}

  export let formData = []

  export let name
  export let id
  export let displayLabel

  export let required = false
  export let disabled = false
  export let readonly = false

  const registry = getContext('registry')
  const { definitions } = registry

  $: title = schema.title || name
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
      uiSchema: uiSchema.items,
    }
  })

  function onAdd() {
    const itemSchema = (isFixedItems(schema) && allowAdditionalItems(schema)) ? schema.allowAdditionalItems : schema.items
    formData = [...formData, getDefaultFormState(itemSchema, undefined, definitions)]
  }
</script>

<Debug title=ArrayField data={{
  name, schema, formData, items
}} />

<!-- 
  React jsonschema form renders several types of arrays
-->

<ArrayFieldTemplate
  bind:formData
  {schema} {idSchema} {uiSchema}
  {title} {required} {disabled} {readonly}
  {items}
  on:add-item={onAdd}
/>