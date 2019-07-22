<script>
  import { getContext } from 'svelte'

  import { getWidget, optionsList, getUiOptions } from '../util'

  export let schema
  export let uiSchema = {}
  export let idSchema

  export let name
  export let formData

  export let required = false
  export let disabled = false
  export let readonly = false
  export let autofocus = false

  const registry = getContext('registry')

  let widget, options
  $: {
    const {
      widget: _widget = "checkbox",
      ..._options
    } = getUiOptions(uiSchema)

    widget = _widget
    options = _options
  }
  $: Widget = getWidget(schema, widget, registry.widgets)
  $: enumOptions =   optionsList({
    enum: [true, false],
    enumNames: schema.enumNames || ["yes", "no"],
  });
</script>

<Widget
  options={{ ...options, enumOptions }}
  {schema}
  id={idSchema && idSchema.$id}
  label={schema.title === undefined ? name : schema.title}
  bind:value={formData}
  {required}
  {disabled}
  {readonly}
  formContext={registry.formContest}
/>