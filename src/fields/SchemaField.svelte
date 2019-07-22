<script>
  import { getContext } from 'svelte'
  import { retrieveSchema } from '../util'
  
  export let schema
  export let uiSchema = {}
  export let errorSchema = {}
  export let idSchema = {}

  export let formData = undefined

  export let name
  export let id = undefined
  export let displayLabel = undefined
  export let description = undefined

  export let required = false
  export let disabled = false
  export let readonly = false

  export let label = undefined
  export let errors = undefined
  export let help = undefined

  const registry = getContext('registry')

  const COMPONENT_TYPES = {
    array: "ArrayField",
    boolean: "BooleanField",
    integer: "NumberField",
    number: "NumberField",
    object: "ObjectField",
    string: "StringField",
  };

  function getField(schema) {
    return registry.fields[COMPONENT_TYPES[schema.type]] || registry.fields.UnsupportedField 
  }

</script>

<div>
  {#if displayLabel}
    <label {required} for={id}>{label}</label>
    {#if description}
      {description}
    {/if}
  {/if}

  <svelte:component
    {name}
    this={getField(schema)}
    schema={retrieveSchema(schema)}
    uiSchema={{ ...uiSchema, classNames: undefined }}
    {id}
    {displayLabel}
    {disabled} {readonly}
  />

  {#if errors}
    {errors}
  {/if}

  {#if help}
    {help}
  {/if}
</div>