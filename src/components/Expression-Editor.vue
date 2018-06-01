<template>
<div>
    <div class="math cursor control preview-style flex">
        <div class="flex" v-for="(n, i) in numberArray" :key="i">
            <div class="flex" v-if="!n.parentheses">
                <span>
                    {{[i, n.op] | opFilter}}
                </span>
                {{n | realValue}}
            </div>
            <div class="flex" v-else>
                <span>
                    {{[i, n.op] | opFilter}}
                </span>                
                (
                <div class="flex" v-for="(p, index) in n.nested" :key="index">

                <span>
                    {{[index, p.op] | opFilter}}
                </span>
                {{p | realValue}}
                </div>
                <span class="flex" :class="parenthesesState">)</span>
            </div>
        </div>
    </div>
</div>    
</template>

<script>
'use strict'
import {Store} from "../assets/JS/state-store";
// import Parentheses from "./Parentheses";

export default {
    data (){
        return {
            store: {},
        }
    },
    components:{
        // 'parentheses': Parentheses
    },
    methods: {       
    },
    computed:{
        nest(){
            return this.store.aN.nested
        },
        numberArray(){
            return this.store.numArray
        },
        parenthesesState(){
            if(Store.parentheses){
                return 'opac3 margin-h'
            }
            return ''
        }
    },
    filters: {
        opFilter(r=[]){
            if(r.length < 1) return
            if(r[0] === 0){    
                return r[1] === '-' ? '−' : ''
            }
            let operator = false;
            switch (r[1]) {
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
        },
        realValue(n){
            if(n.value !== (false)) return n.value
            return ''
        },
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
.opac3{
    opacity: 0.3;
}
</style>
