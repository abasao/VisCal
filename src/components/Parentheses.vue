<template>
  <div class="flex">
      {{ parentheses[0] }}
      <slot>

      </slot>
      {{ parentheses[1] }}
  </div>
</template>

<script>
export default {
    props:['bool'],
    computed:{
        parentheses(){
            return this.bool ? ['(', ')'] : ['','']
        }
    }
}
</script>
