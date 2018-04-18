<template>
  <div class="hello">
    <h1>
      {{message}}
    </h1>
    <button @click='eventEmitter({e: $event, msg: "my little friend"})'>Say Hello to</button>
  </div>
</template>

<script>
import { EventBus } from "../assets/JS/event-bus";

export default {
  name: 'Hello',
  props: ['msg', 'name', 'age'],
  data () {
    return {
      message: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
      eventEmitter(payload){
          EventBus.$emit("laugh", payload)
      },    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hello {
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
}
</style>
