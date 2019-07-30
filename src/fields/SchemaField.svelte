<script>
  import { getContext } from 'svelte'

  import Debug from '../components/Debug.svelte'
  import FieldTemplate from '../components/FieldTemplate.svelte'

  import {
    retrieveSchema, getUiOptions,
    isMultiSelect, isFilesArray,
  } from '../util'
  
  export let uiSchema = {}
  export let errorSchema = {}
  export let idSchema = {}

  export let formData = undefined

  export let name = null
  export let id = undefined
  export let displayLabel = undefined

  export let required = false
  export let disabled = false
  export let readonly = false

  export let errors = undefined
  export let help = undefined

  let _schema
  export { _schema as schema }
  
  let label = undefined

  const registry = getContext('registry')

  const COMPONENT_TYPES = {
    array: "ArrayField",
    boolean: "BooleanField",
    integer: "NumberField",
    number: "NumberField",
    object: "ObjectField",
    string: "StringField",
  }

  $: schema = retrieveSchema(_schema, registry.definitions)
  $: description = uiSchema["ui:description"] || schema.description
  function getField(schema) {
    return registry.fields[COMPONENT_TYPES[schema.type]] || registry.fields.UnsupportedField 
  }

  function mustDisplayLabel(schema, uiSchema) {
    const uiOptions = getUiOptions(uiSchema);
    let { label: displayLabel = true } = uiOptions;
    if (schema.type === "array") {
      displayLabel =
        isMultiSelect(schema, registry.definitions) ||
        isFilesArray(schema, uiSchema, registry.definitions);
    }
    if (schema.type === "object") {
      displayLabel = false;
    }
    if (schema.type === "boolean" && !uiSchema["ui:widget"]) {
      displayLabel = false;
    }
    if (uiSchema["ui:field"]) {
      displayLabel = false;
    }
    // console.log("displayLabel?", schema, uiSchema, uiOptions, displayLabel)
    return displayLabel
  }

  $: displayLabel = mustDisplayLabel(schema, uiSchema)

</script>

<Debug title=schemaField data={{
  name, formData, id, displayLabel, idSchema, props: $$props
}}/>

<FieldTemplate
  {id}
  label={uiSchema["ui:title"] || schema.title || name}
  {required} {readonly}
  {help} {errors}
  {description}
  {displayLabel}
  hidden={uiSchema["ui:widget"] === "hidden"} 
>
  <!-- Something with props -->
  <svelte:component
    {name}
    this={getField(schema)}
    {schema} {errorSchema} {idSchema}
    uiSchema={{ ...uiSchema, classNames: undefined }}
    {id}
    {disabled} {readonly}
    bind:formData
  />
</FieldTemplate>
