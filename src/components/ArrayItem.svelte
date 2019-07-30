<script>
  import { getContext, createEventDispatcher } from 'svelte'
  import Debug from './Debug.svelte'

  import IconBtn from './IconBtn.svelte'
  let className = ''
  export { className as class}

  export let index
  export let canRemove = true
  export let canMoveUp = true
  export let canMoveDown = true

  export let schema
  export let idSchema
  export let uiSchema = {}
  export let itemUiSchema = {}
  export let errorSchema

  export let itemData

  export let disabled = false
  export let readonly = false

  const dispatch = createEventDispatcher()

  const { fields: { SchemaField }} = getContext('registry')

  $: options = {
    orderable: true,
    removable: true,
    ...uiSchema["ui:options"],
  }
  let has
  $: {
    has = {
      moveUp: options.orderable && canMoveUp,
      moveDown: options.orderable && canMoveDown,
      remove: options.removable && canRemove,
    }
    has.toolbar = Object.keys(has).some(key => has[key])
  }


  function isItemRequired(itemSchema) {
    if (Array.isArray(itemSchema.type)) {
      // While we don't yet support composite/nullable jsonschema types, it's
      // future-proof to check for requirement against these.
      return !itemSchema.type.includes("null");
    }
    // All non-null array item types are inherently required by design
    return itemSchema.type !== "null";
  }
</script>

<style>

  .array-item {
    display: flex;
  }
  .toolbox {
    display: flex;
  }
  .order-buttons {
    display: flex;
    justify-content: space-around;
  }
</style>

<Debug title=ArrayItem data={{$$props, orderable: options.orderable, removable: options.removable}} />

<div class='array-item {className}'>
  <div class={has.toolbar ? "col-xs-9" : "col-xs-12"}>
    <SchemaField {schema} {uiSchema} {errorSchema} {idSchema}
      bind:formData={itemData}
      required={isItemRequired(schema)}
      {disabled} {readonly}
    />
  </div>

  {#if has.toolbar}
    <div class="toolbox">
      <div class="order-buttons">
        {#if has.moveUp || has.moveDown}
          <button type=button disabled={disabled || readonly || !has.moveUp} on:click={() => dispatch('reorder-item', [index, index - 1])}>
            ˄
          </button>
         <!--  <IconBtn
            icon="arrow-up"
            class="array-item-move-up"
            tabIndex="-1"
            disabled={disabled || readonly || !has.moveUp}
          /> -->
            <!-- onClick={onReorderClick(index, index - 1)} -->


          <button type=button disabled={disabled || readonly || !has.moveDown} on:click={() => dispatch('reorder-item', [index, index + 1])}>
            ˅
          </button>
<!--           <IconBtn
            icon="arrow-down"
            class="array-item-move-down"
            tabIndex="-1"
            disabled={
              disabled || readonly || !has.moveDown
            }
          /> -->
            <!-- onClick={onReorderClick(index, index + 1)} -->
        {/if}

        {#if has.remove}
          <button type=button disabled={disabled || readonly} on:click={() => dispatch('delete-item', index)}>
            x
          </button>
          <!-- <IconBtn
            type="danger"
            icon="remove"
            class="array-item-remove"
            tabIndex="-1"
            disabled={disabled || readonly}
          /> -->
            <!-- onClick={onDropIndexClick(index)} -->
        {/if}
      </div>
    </div>
  {/if}
</div>