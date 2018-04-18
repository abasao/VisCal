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
// import state from "./assets/JS/event-handler"
import { init } from "./assets/JS/event-handler"

export default {
  name: 'App',
  components: {
    Expression,
    'control': Control    
  },
  created () {
    init()
    // EventBus.$emit('test', 1)
  },
  data(){
    return {
    }
  },
}
</script>

