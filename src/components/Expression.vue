<template>
<div>
  <edit/>
  <div class="math margin-v">
      <!-- <div class="term-flex term-style cursor" v-for="(num, index) in numbers" :key="index">
            <div class="object-style" v-if="showSign(index, num.value)">
                <span class="btn-value" @click="add(index)">{{num.value | sign}}</span>
            </div>
            
            <number class="object-style object-hover margin-h" 
            v-bind="{numberProp: num, functions: num.methods()}"/>
      </div> -->
      <div class="term-flex term-style cursor">
            <number class="object-style object-hover margin-h" 
            v-bind="{numberProp: numbers, functions: numbers.methods(), root: true}"/>
      </div>
  </div>
</div>
</template>

<script>
'use strict'
import NumberComp from "./Number";
import Editor from "./Expression-Editor";
import {Store} from "../assets/JS/state-store";
export default {
    props: ['numbers', 'stateIndex' /*, 'functions'*/],
    data (){
        return {
            store: {},
        }
    },
    // methods: {
    //     showSign(i, value){
    //         return i!==0 || (i===0 && value < 0)
    //     },  
    //     add(i){
    //         this.functions.add(i)
    //     }
    // },
    // filters: {
    //     sign(x){
    //         return x < 0 ? '−' : '+'
    //     },
    // },            
    components: {
        'number': NumberComp,
        'edit': Editor
    },
    created (){

    },
}
</script>
