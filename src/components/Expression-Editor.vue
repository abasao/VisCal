<template>
<div>
    <div class="math cursor control preview-style flex">
        <div v-for="(n, i) in numberArray" :key="i">
            {{[i, n.op] | minFilter}}{{n | realValue}}
        </div>
    </div>
    <div class="math cursor control preview-style flex" v-if="false && nest.length > 0">
        <div class="flex" 
            v-for="(num, index) in nest" :key="index">
            <!-- Not Holder -->
            <div class="btn-style" v-if="!holder(index)">
                <span class="btn-value" v-if="showSign(index)">
                    {{num.sign | sign}}
                </span>
                <span class="btn-value" v-else-if="showSign(index, num.sign)">
                    <span class="negative-sign" >
                        {{num.sign | sign}}
                    </span>
                </span>     
                {{num | realValue}}
            </div>
            <!-- Holder but not fraction -->
            <div  class="btn-style flex" v-else-if="!fraction(index)">
                <span class="btn-value" v-if="showSign(index)">
                    {{num.sign | sign}}
                </span>
                <span class="btn-value" v-else-if="showSign(index, num.sign)">
                    <span class="negative-sign" >
                        {{num.sign | sign}}
                    </span>
                </span>
                <parentheses :bool='siblingParentheses(index)'>
                    <div class="btn-style btn-value" v-for="(sib, sindex) in num.sibling" :key="sindex">
                        <span class="btn-value" v-if="sib.op">
                            {{sib.op | operator}} 
                        </span>
                        {{sib | realValue}}
                    </div>
                </parentheses>
                <div  class="flex" v-if="child(index)">
                    <span class="btn-value">
                        {{num.nestOp | operator}} 
                    </span>
                    <parentheses :bool='true'>
                        <span class="btn-value margin-h" v-for="(n, i) in num.nested" :key="i">
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
            <div class="fraction" v-else>
                <div class="numerator flex">
                    <div class="btn-style" v-for="(nume, nindex) in num.sibling" :key="nindex">
                        <span class="btn-value" v-if="nume.op">
                            {{nume.op | operator}} 
                        </span>
                        {{nume | realValue}}
                    </div>
                </div>
                <div class="denominator flex">
                    <div class="btn-style" v-for="(denom, dindex) in num.nested" :key="dindex">
                        <span class="btn-value" v-if="showSign(dindex)">
                            {{denom.sign | sign}}
                        </span>
                        <span class="btn-value" v-else-if="showSign(dindex, denom.sign)">
                            <span class="negative-sign" >
                                {{denom.sign | sign}}
                            </span>
                        </span>
                        {{denom | realValue}}
                    </div>
                </div>
            </div>
        </div>
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
        child(i=0){
            if(this.nest[i].nested.length===0){ 
                return false
            }
            return this.nest[i].nested
        },
        holder(i=0){
            if(this.nest[i].holder){ 
                return this.nest[i]
            }
            return false           
        },
        sibling(i=0){
            if(this.nest[i].sibling.length===0){ 
                return false
            }
            return this.nest[i].sibling            
        },
        fraction(i=0){
            if(this.nest[i].nestOp && this.nest[i].nestOp === '/'){ 
                return true
            }
            return false  
        },
        showParentheses(i=0){
            if(i < this.nest.length-1) return [true,true]
            if(Store.parentheses) return [true,false]
            return [true, true]
        },
        siblingParentheses(i=0){
            if(this.sibling(i).some(x => ['+','-'].includes(x.op))){
                if(Store.parentheses && !this.child(i)) return [true,false]
                return [true, true]
            }
            return [false, false]
        }         
    },
    computed:{
        nest(){
            return this.store.aN.nested
        },
        numberArray(){
            return this.store.numArray
        }
    },
    filters: {
        minFilter(r=[]){
            if(r.length < 1) return
            if(r[0] === 0){    
                return r[1] === '-' ? '-' : ''
            }
            return r[1]
        },
        realValue(n){
            if(n.value !== (1 && false)) return n.value
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
.fraction{
    display: flex;
    flex-direction: column;
}
.numerator{
    border-bottom: 2px solid black;
}
</style>
