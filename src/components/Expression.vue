<template>
<div>
  <edit/>
  <div class="math margin-v">
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
    props: ['numbers', 'stateIndex'],
    data (){
        return {
            store: {},
        }
    },           
    components: {
        'number': NumberComp,
        'edit': Editor
    },
    created (){

    },
}
</script>
