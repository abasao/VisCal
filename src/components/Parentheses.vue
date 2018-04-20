<template>
  <div class="flex">
      {{ parenthesis[0] }}
      <slot>

      </slot>
      {{ parenthesis[1] }}
  </div>
</template>

<script>
export default {
    props:['bool'],
    computed:{
        parenthesis(){
            return this.bool ? ['(', ')'] : ['','']
        }
    }

}
</script>
