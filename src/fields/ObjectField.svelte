<script>
  import { getContext } from 'svelte'

  export let schema
  export let uiSchema = {}
  export let errorSchema = {}
  export let idSchema = {}

  export let formData = {}

  export let name
  export let id
  export let displayLabel

  export let required = false
  export let disabled = false
  export let readonly = false

  const registry = getContext('registry')
  
  // export let registry // Store??
  const isRequired = name => Array.isArray(schema.required) && schema.required.indexOf(name) !== -1

  $: title = schema.title === undefined ? name : schema.title
  $: SchemaField = registry.fields.SchemaField

</script>


<!-- Something about order:properties in uiSchema["ui:order"] -->

<fieldset>
  {#if uiSchema["ui:title"] || title}
    <legend id="{idSchema.$id}__title">
      {title || uiSchema['ui:title']}{required ? '*' : ''}
    </legend>
  {/if}
  
  <p>DescriptionField</p>

  {#each Object.keys(schema.properties) as name (name) }
    <SchemaField
      {name}
      required={isRequired(name)}
      schema={schema.properties[name]}
      uiSchema={uiSchema[name]}
      errorSchema={errorSchema[name]}
      idSchema={idSchema[name]}
      bind:formData={formData[name]}
      disabled={disabled}
      readonly={readonly}
    />
<!--       onChange={this.onPropertyChange(name)}
      onBlur={onBlur}
      onFocus={onFocus} -->
  {/each}

</fieldset>
