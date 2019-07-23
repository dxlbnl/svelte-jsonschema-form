<script>
  import Label from './Label.svelte'
  import ErrorList from './FieldErrorList.svelte'
  import Help from './Help.svelte'

  import Debug from './Debug.svelte'

  export let id
  export let classnames = ''
  export let label
  export let errors
  export let help
  export let description
  export let readonly
  export let hidden = false
  export let required = false
  export let displayLabel = true

</script>

<Debug title=fieldTemplate data={{
  id, label, errors, help, description, hidden, required, displayLabel
}} />

{#if !hidden}
  <div class={classnames}>
    {#if displayLabel}
      <Label {label} {required} {id} />
      {#if description}
        {description}
      {/if}
    {/if}

    <slot />

    <ErrorList errors={errors} />
    <Help help={help} />
  </div>
{:else}
  <slot />
{/if}