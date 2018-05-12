<template>
    <div class="math cursor control preview-style flex" v-if="nest.length > 0">
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
            <!-- Holder with no nest -->
            <div class="flex" v-else-if="holder(index) && !child(index)">
                <span class="btn-value" v-if="showSign(index)">
                    {{num.sign | sign}}
                </span>
                <span class="btn-value" v-else-if="showSign(index, num.sign)">
                    <span class="negative-sign" >
                        {{num.sign | sign}}
                    </span>
                </span>
                <div class="btn-style btn-value" v-for="(sib, sindex) in num.sibling" :key="sindex">
                    <span class="btn-value" v-if="sib.op">
                        {{sib.op | operator}} 
                    </span>
                    {{sib | realValue}}
                </div>
            </div>
            <!-- Fractions -->
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

        <!-- 
        <div class="btn-style btn-value" v-if="!sibling(index)">
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
        <div class="btn-style btn-value flex" v-if="num.nestOp">            
            {{num.nestOp | operator}}
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
        <div class="btn-style flex" v-if="sibling(index)">
                <span class="btn-value margin-h" v-for="(n, i) in sibling(index)" :key="i">
                <span class="btn-value" v-if="n.op">
                    {{num.op | operator}} 
                </span>                    
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
        </div> -->

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
        showParentheses(i=0){
            if(i < this.nest.length-1) return [true,true]
            if(Store.parentheses) return [true,false]
            return [true, true]
        },         
    },
    computed:{
        nest(){
            return this.store.aN.nested
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
.fraction{
    display: flex;
    flex-direction: column;
}
.numerator{
    border-bottom: 2px solid black;
}
</style>
