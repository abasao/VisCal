<template>
  <div class="flex margin-h">
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
            if(typeof this.bool === 'boolean'){
                return this.bool ? ['(', ')'] : ['','']
            }
            return ['','']
        }
    }
}
</script>

