<template>
  <div class="math cursor control preview-style flex">
      <div class="btn-style btn-value" v-if="nest.length > 0">
          {{nest[0].sign | minusSign}} {{nest[0] | realValue}}
      </div>
      <div class="btn-style flex" v-if="child">
        {{nest[0].op | operator}} 
        <parentheses :bool='showParentheses'>
            <span class="btn-value margin-h" v-for="(n, i) in child" :key="i">
                <span class="btn-value"  v-if="showSign(i)">
                    {{n.sign | sign}}
                </span>
                <span class="btn-value" v-else-if="showSign(i, n.sign)">
                    <span class="negative-sign" >
                        {{n.sign | sign}}
                    </span>
                </span>
                    {{n | realValue}}
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
            T: {}
        }
    },
    components:{
        'parentheses': Parentheses
    },
    methods: {
        showSign(i,...sign){
            if(typeof i === 'number' && sign.length === 0){
                return i !== 0
            }
            return i === 0 && sign[0] === '-'
        },
    },
    computed:{
        nest(){
            return this.store.aN.nested
        },
        child(){
            if(this.nest.length === 0){ 
                return false
            }else if(this.nest[0].nested.length===0){ 
                return false
            }
            return this.nest[0].nested
        },
        showParentheses(){
            if(this.child && this.child.length > 1){
                return true
            }else if(this.child && this.child[0].sign === '-'){
                return true
            }
            return false
        },        
    },
    filters: {
        realValue(n){
            if(n.value !== 1) return n.value
            return ''
        },
        minusSign(sign){
            if(sign === '-') return '−'
            return ''
        },
        sign(s){
            if(s === '+'){
                return '+'
            }
            return '−'
        },
        operator(op){
            let operator = false;
            switch (op) {
                case '*':
                    operator = '×';
                    break;
                case '/':
                    operator = '÷';
                    break;
                case '+':
                    operator = '+';
                    break;
                case '-':
                    operator = '−';
                    break;
            
                default:
                    operator = '×';
                    break;
            }
            return operator
        }
    },
    created (){
        this.store = Store;
},
}
</script>

<style>

</style>
