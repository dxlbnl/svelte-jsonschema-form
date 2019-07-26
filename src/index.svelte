<script>
  import { setContext } from 'svelte'
  import { toIdSchema } from './util'
  import SchemaField from './fields/SchemaField.svelte'
  import { showDebug } from './components/Debug.svelte'
  import ArrayFieldTemplate from './components/ArrayFieldTemplate.svelte'
  import ErrorList from './components/FormErrorList.svelte'

  import validateFormData from './validate'

  import * as fields from './fields'
  import * as widgets from './widgets'

  export let id = 'form'
  export let name = null
  export let target = null
  export let action = null

  export let noValidate = false
  export let liveValidate = false
  export let safeRenderCompletion = false
  export let noHtml5Validate = false

  export let schema
  export let uiSchema = {}

  export let formData = {}
  export let formContext = {}
  export let registry = {
    fields,
    widgets,
    definitions: {},
    formContext: {},
  }

  export let transformErrors = e => e

  let errors = [], errorSchema = []

  $: {
    registry.definitions = schema.definitions
  }

  $: edit = typeof formData !== 'undefined'
  $: if (formData && edit && !noValidate && liveValidate) {
    console.log("Validating")
    const validated = validate(formData, schema)
    errors = validated.errors
    errorSchema = validated.errorSchema
  }
  $: idSchema = toIdSchema(schema, uiSchema["ui:rootFieldId"], schema.definitions)

  setContext('registry', registry)

  function validate (formData, schema) {
    return validateFormData(
      formData,
      schema,
      validate,
      transformErrors
    )
  }

</script>

<h1>Form</h1>
<label>debug</label><input type=checkbox bind:checked={$showDebug} />

<form on:submit
  {id} {name}
  {target} {action}
>
  <ErrorList
    {errors}
    {errorSchema}
    {schema}
    {uiSchema}
    {formContext}
  />
  <SchemaField
    {schema}
    {uiSchema}
    {idSchema}
    bind:formData
  />

  <slot>
    <button type="submit">
      Submit
    </button>
  </slot>
</form>