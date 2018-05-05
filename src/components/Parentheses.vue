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
            if(typeof this.bool === 'boolean'){
                return this.bool ? ['(', ')'] : ['','']
            }else if(typeof this.bool === 'object'){
                if(this.bool[0] && this.bool[1]){
                    return ['(', ')']
                }else if(this.bool[0] && !this.bool[1]){
                    return ['(', '']
                }else{
                    return ['','']
                }
            }
        }
    }
}
</script>
