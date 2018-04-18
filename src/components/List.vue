<template>
  <div class="my-list">
    <!-- <button @click='eventEmitter({e: $event, msg: "right now!"})'>Do this</button> -->
    <button @click='EventBus.$emit("laugh", {e: $event, msg: "right now!"})'>Do this</button>
    <h1 v-show="true">My To Do List</h1>
    <br>
    <!--displays list -->
    <input @keyup.enter='addTodo($event) || register($event)' type="text" v-model='todoItem'>
    <button @click="addTodo">Add</button>
    <ul v-for="(item, index) in listItems" :key='index'>
      <li @click='register($event) || log(index)'>{{ index +': '+item }}</li>
    </ul>
  </div>
</template>

<script>
'use strict'
import { EventBus } from "../assets/JS/event-bus";

export default {
  name: 'list',
  data () {
    return {
      listItems: ['buy food', 'play games', 'sleep'],
      todoItem: '',
      EventBus: EventBus,
    }
  },
  methods: {
      log(e){
          console.log(e)
      },
      eventEmitter(payload){
          EventBus.$emit("laugh", payload)
      },
      addTodo(event){
          this.listItems.push(this.todoItem)
          this.todoItem = ''
      },
      register(event){
          console.log('from register event')
          console.log(event)
      },
      log(i){
          console.log(i)
          this.listItems.splice(i,1);
      }
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: inherit;
}
.mylist *{
    box-sizing: border-box;
    width: 500px;
    margin: 0 auto;
}

ul{
    list-style: none;
}
</style>
