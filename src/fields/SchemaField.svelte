<script>
  import { getContext } from 'svelte'

  import Debug from '../components/Debug.svelte'

  import { retrieveSchema, getUiOptions } from '../util'
  
  import FieldTemplate from '../components/FieldTemplate.svelte'

  export let schema
  export let uiSchema = {}
  export let errorSchema = {}
  export let idSchema = {}

  export let formData = undefined

  export let name
  export let id = undefined
  export let displayLabel = undefined

  export let required = false
  export let disabled = false
  export let readonly = false

  export let errors = undefined
  export let help = undefined

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

  $: description = uiSchema["ui:description"] || schema.description

  function getField(schema) {
    return registry.fields[COMPONENT_TYPES[schema.type]] || registry.fields.UnsupportedField 
  }

  function mustDisplayLabel(schema, uiSchema) {
    const uiOptions = getUiOptions(uiSchema);
    let { label: displayLabel = true } = uiOptions;
    // if (schema.type === "array") {
    //   displayLabel =
    //     isMultiSelect(schema, definitions) ||
    //     isFilesArray(schema, uiSchema, definitions);
    // }
    if (schema.type === "object") {
      displayLabel = false;
    }
    if (schema.type === "boolean" && !uiSchema["ui:widget"]) {
      displayLabel = false;
    }
    if (uiSchema["ui:field"]) {
      displayLabel = false;
    }

    console.log("DisplayLabel:", schema, displayLabel)
    return displayLabel
  }

</script>

<Debug title=schemaField data={{
  name, formData, id, displayLabel
}}/>

<FieldTemplate
  {id}
  label={uiSchema["ui:title"] || schema.title || name}
  {required} {readonly}
  {help} {errors}
  {description}
  displayLabel={mustDisplayLabel(schema, uiSchema)}
  hidden={uiSchema["ui:widget"] === "hidden"} 
>
  <svelte:component
    {name}
    this={getField(schema)}
    schema={retrieveSchema(schema)}
    uiSchema={{ ...uiSchema, classNames: undefined }}
    {id}
    {displayLabel}
    {disabled} {readonly}
    bind:formData
  />
</FieldTemplate>
