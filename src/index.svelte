<script>
  import { setContext } from 'svelte'
  import { toIdSchema } from './util'
  import SchemaField from './fields/SchemaField.svelte'

  import * as fields from './fields/index'
  import * as widgets from './widgets/index'

  export let schema
  export let uiSchema = {}

  export let formData = {}
  export let registry = {
    fields,
    widgets,
    definitions: {},
    formContext: {},
  }

  setContext('registry', registry)

  $: idSchema = toIdSchema(schema, uiSchema["ui:rootFieldId"], schema.definitions)
</script>

<h1>Form</h1>

<form on:submit>
  <SchemaField {schema} {uiSchema} {idSchema} bind:formData />

  <slot>
    <button type="submit">
      Submit
    </button>
  </slot>
</form>