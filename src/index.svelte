<script>
  import { toIdSchema } from './util'
  import SchemaField from './fields/SchemaField.svelte'

  import * as fields from './fields'
  import * as widgets from './widgets'

  export let schema
  export let uiSchema = {}

  export let formData = {}
  export let registry = {
    fields,
    widgets,
    definitions: {},
    formContext: {},
  }

  $: idSchema = toIdSchema(schema, uiSchema["ui:rootFieldId"], schema.definitions)
</script>

<h1>Form</h1>

<form on:submit>
  <SchemaField {schema} {uiSchema} {idSchema} {formData} {registry} />

  <slot>
    <button type="submit">
      Submit
    </button>
  </slot>
</form>