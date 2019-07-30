<script>
  import IconBtn from './IconBtn.svelte'

  let classNames
  export let disabled
</script>

<div class="row">
  <p class="col-xs-3 col-xs-offset-9 array-item-add text-right">
    <button type=button on:click {disabled}> + </button>
<!--     <IconBtn
      type="info"
      icon="plus"
      class="btn-add col-xs-12"
      tabIndex="0"
      on:click
      {disabled}
    /> -->
  </p>
</div>
