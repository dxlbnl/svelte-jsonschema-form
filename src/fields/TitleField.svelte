<script>
  export let id
  export let title
  export let required
</script>

<legend {id}>
  {`${title}${required ? '*' : ''}`}
</legend>