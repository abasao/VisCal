<template>
  <div id="app">
    <expression/>
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
  created () {
    State.createState();
    init()
  },
  data(){
    return {
    }
  },
}
</script>

