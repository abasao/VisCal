<template>
  <div id="app">

    <div v-for="(n, i) in numberStore" :key="i">
      <expression v-bind="{numbers: n.nested, stateIndex: i}"/>
    </div>
    <control/>
  </div>
</template>

<script>
'use strict'
import Expression from "./components/Expression";
import Control from "./components/Control";
import { EventBus } from "./assets/JS/event-bus";
import State from "./assets/JS/state-store"
import { init } from "./assets/JS/event-handler"

export default {
  name: 'App',
  components: {
    Expression,
    'control': Control    
  },
  data(){
    return {
      numberStore: []
    }
  },
  created () {
    State.createState();
    this.numberStore = State.Store.numbers;
    init();
  },
}
</script>

