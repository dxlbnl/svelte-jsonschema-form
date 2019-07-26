<script>
  import { getContext } from 'svelte'

  import IconBtn from './IconBtn.svelte'
  let className = ''
  export { className as class}

  export let index
  export let canMoveUp = false
  export let canMoveDown = false

  export let schema
  export let idSchema
  export let uiSchema
  export let errorSchema

  export let itemData

  export let disabled = false
  export let readonly = false

  export let hasToolbar = false
  export let hasMoveUp = false
  export let hasMoveDown = false
  export let hasRemove = false

  const { fields: { SchemaField }} = getContext('registry')

  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold",
  };

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

<div class={className}>
  <div class={hasToolbar ? "col-xs-9" : "col-xs-12"}>
    <SchemaField {schema} {uiSchema} {errorSchema} {idSchema}
      bind:formData={itemData}
      required={isItemRequired(schema)}
      {disabled} {readonly}
    />
  </div>

  {#if hasToolbar}
    <div class="col-xs-3 array-item-toolbox">
      <div
        class="btn-group"
        style={{ display: "flex", justifyContent: "space-around" }}>
        {#if hasMoveUp || hasMoveDown}
          <IconBtn
            icon="arrow-up"
            class="array-item-move-up"
            tabIndex="-1"
            style={btnStyle}
            disabled={disabled || readonly || !hasMoveUp}
          />
            <!-- onClick={onReorderClick(index, index - 1)} -->

          <IconBtn
            icon="arrow-down"
            class="array-item-move-down"
            tabIndex="-1"
            style={btnStyle}
            disabled={
              disabled || readonly || !hasMoveDown
            }
          />
            <!-- onClick={onReorderClick(index, index + 1)} -->
        {/if}

        {#if hasRemove}
          <IconBtn
            type="danger"
            icon="remove"
            class="array-item-remove"
            tabIndex="-1"
            style={btnStyle}
            disabled={disabled || readonly}
          />
            <!-- onClick={onDropIndexClick(index)} -->
        {/if}
      </div>
    </div>
  {/if}
</div>