<script>
  import { getContext } from 'svelte'

  import {
    getDefaultFormState,
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

  function onAdd() {
    const itemSchema = (isFixedItems(schema) && allowAdditionalItems(schema)) ? schema.allowAdditionalItems : schema.items
    formData = [...formData, getDefaultFormState(itemSchema, undefined, definitions)]
  }

  function onDelete (event) {
    event.stopPropagation()
    const index = event.detail

    formData = formData.filter((_, i) => i !== index)
  }

  function onReorder (event) {
    event.stopPropagation()
    const [from, to] = event.detail

    formData = formData.map((item, i, array) => (
      (i === from)
        ? array[to]
        : (i === to)
          ? array[from]
          : item
    ))
  }
</script>

<Debug title=ArrayField data={{
  name, schema, formData, uiSchema
}} />

<!-- 
  React jsonschema form renders several types of arrays
-->

<ArrayFieldTemplate
  bind:formData
  {schema} {idSchema} {uiSchema} {errorSchema}
  {title} {required} {disabled} {readonly}
  on:add-item={onAdd}
  on:delete-item={onDelete}
  on:reorder-item={onReorder}
/>