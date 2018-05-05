<template>
  <div class="math cursor control preview-style flex" v-if="nest.length > 0">
      <div class="flex" 
      v-for="(num, index) in nest" :key="index">

        <div class="btn-style btn-value">
            <span class="btn-value" v-if="num.op">
                {{num.op | operator}} 
            </span>
            <span class="btn-value" v-else-if="showSign(index)">
                {{num.sign | sign}}
            </span>
            <span class="btn-value" v-else-if="showSign(index, num.sign)">
                <span class="negative-sign" >
                    {{num.sign | sign}}
                </span>
            </span>     
            {{num | realValue}}
        </div>
        <div class="btn-style flex" v-if="num.nestOp">            
            {{num.nestOp | operator}} nest
        </div>
        <div class="btn-style flex" v-if="child(index) !== false">
            <parentheses :bool='showParentheses(index)'>
                <span class="btn-value margin-h" v-for="(n, i) in child(index)" :key="i">
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
      <!-- <div class="btn-style btn-value" v-if="nest.length > 0">
          {{nest[0].sign | minusSign}} {{nest[0] | realValue}}
      </div> -->

      <!-- <div class="btn-style flex" v-if="child">
        {{nest[0].nestOp | operator}} 
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
      </div> -->
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
        child(i=0){
            if(this.nest[i].nested.length===0){ 
                return false
            }
            return this.nest[i].nested
        },
        showParentheses(i=0){
            if(i < this.nest.length-1) return [true,true]
            if(Store.parentheses) return [true,false]
            return [true, true]
            /*
            if(this.child(i) && this.child(i).length > 1){
                return true
            }else if(this.child(i) && this.child(i)[0].sign === '-'){
                return true
            }
            return false
            */
        },         
    },
    computed:{
        nest(){
            return this.store.aN.nested
        },
        // child(i=0){
        //     if(this.nest.length === 0){ 
        //         return false
        //     }else if(this.nest[i].nested.length===0){ 
        //         return false
        //     }
        //     return this.nest[i].nested
        // },
        // showParentheses(i=0){
        //     if(this.child(i) && this.child(i).length > 1){
        //         return true
        //     }else if(this.child(i) && this.child(i)[0].sign === '-'){
        //         return true
        //     }
        //     return false
        // },        
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
