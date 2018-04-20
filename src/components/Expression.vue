<template>
<div>
  <edit/>
  <div class="math margin-v">
      <div class="term-flex term-style cursor" v-for="(num, index) in numbers" :key="index">
            <div class="object-style" v-if="showOp(index, num.sign)">
                <span class="btn-value">{{num.sign}}</span>
            </div>
            
            <number class="object-style object-hover margin-h" 
            v-bind="{numberProp: num, functions: num.methods(num)}"/>
            
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
    props: ['numbers', 'stateIndex'],
    data (){
        return {
            store: {},
        }
    },
    methods: {
        showOp(i, sign){
            return i!==0 || (i===0 && sign !== '+')
        },  
    },
    components: {
        'number': NumberComp,
        'edit': Editor
    },
    created (){

    },
}
</script>
