<template>
  <div class="math cursor control preview-style flex">
      <div class="btn-style btn-value" v-if="store.aN.value">
          {{store.aN.value}}
      </div>
      <div class="btn-style flex" v-if="typeof store.aN.nested === 'object' && store.aN.nested.length > 0">
        × 
        <parentheses :bool='showParentheses'>
            <span class="btn-value" v-for="(n, i) in store.aN.nested" :key="i">
                {{n | empty}}
                <span class="btn-value margin-h" v-if="i + 1 < store.aN.nested.length">
                    +
                </span>
            </span>
        </parentheses>        
      </div>
  </div>  
</template>

<script>
'use strict'
import {Store} from "../assets/JS/state-store";
import Parentheses from "./Parentheses";

export default {
    data (){
        return {
            store: {},
        }
    },
    components:{
        'parentheses': Parentheses
    },
    computed:{
        showParentheses(){
            if(this.store.aN.nested.length < 2) return false
            return this.store.aN.nested[0].sign !== '+'
        }
    },
    filters: {
        empty(n){
            if(typeof n === 'string') return n
            return ''
        }
    },
    created (){
        this.store = Store;
    },
}
</script>

<style>

</style>
