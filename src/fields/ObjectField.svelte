<script>
  import { getContext } from 'svelte'
  import { orderProperties } from '../util'
  import Debug from '../components/Debug.svelte'

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
  const { fields: { DescriptionField, TitleField, SchemaField }} = registry
  
  // export let registry // Store??
  const isRequired = name => Array.isArray(schema.required) && schema.required.indexOf(name) !== -1

  $: title = (schema.title === undefined ? name : schema.title) || uiSchema['ui:title']
  $: description = uiSchema["ui:description"] || schema.description

</script>


<!-- Something about order:properties in uiSchema["ui:order"] -->
<Debug title=ObjectField data={$$props} />

<fieldset>
  {#if uiSchema["ui:title"] || title}
    <TitleField id="{idSchema.$id}__title" {title} />
  {/if}
  
  {#if description}
    <DescriptionField id={`${idSchema.$id}__description`} {description} />
  {/if}

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
