<script>
  export let description
  export let id
</script>

<div {id} class="field-description">
  <slot>
    <p>{description}</p>
  </slot>
</div>