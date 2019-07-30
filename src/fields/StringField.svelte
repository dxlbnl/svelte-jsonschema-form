<script>
  import { getContext } from 'svelte'

  import { getUiOptions, getWidget } from '../util'

  export let schema
  export let uiSchema = {}
  export let idSchema = {}
  export let errorSchema = {}

  export let formData = ''

  export let name
  export let id
  export let displayLabel

  export let required = false
  export let disabled = false
  export let readonly = false

  const registry = getContext('registry')

  let widget, placeholder, options

  $: enumOptions = false
  $: defaultWidget = schema.format || (enumOptions ? "select" : "text")
  $: {
    const {
      widget: _widget = defaultWidget,
      placeholder: _placeholder = '',
      ..._options
    } = getUiOptions(uiSchema)

    widget = _widget
    placeholder = _placeholder
    options = _options
  }

  $: Widget = getWidget(schema, widget, registry.widgets)

</script>


<svelte:component this={Widget}
  {schema}
  id={idSchema && idSchema.$id}
  label={schema.title === undefined ? name : schema.title}
  bind:value={formData}
  {required} {disabled} {readonly}

/>