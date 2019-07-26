<script>
  export let type
  let className = ''
  export { className as class }
  export let icon
  export let tabIndex = 0
  export let style = {}
  export let disabled = false
</script>

<button
  type="button"
  class={`btn btn-${type} ${className}`}
  on:click
  {tabIndex}
  {style}
  {disabled}
>
  <i className={`fas fa-${icon}`} />
</button>