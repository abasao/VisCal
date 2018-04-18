<template>
  <div class="math">
      <div class="term-flex term-style" v-for="(num, index) in numbers" :key="index">
            <number class="object-style object-hover" :numberProp='num'/>
            <div class="object-style" v-if="index + 1 < numbers.length">
                +
            </div>
      </div>
  </div>
</template>

<script>
import { EventBus } from "../assets/JS/event-bus";
import NumberComp from "./Number";
import mod from "../assets/JS/methods";

export default {
    data (){
        return {
            numbers: [],
        }
    },
    methods: {
        
    },
    computed: {

    },
    components: {
        'number': NumberComp
    },
    created (){
        let __id = 1000+Math.floor(Math.random()*200)
        this.numbers = mod.rng(2, 10, 1).map((num, i) => { return {
            id: __id+'x'+i, value: num, factor: mod.factorize(num),
            nested: [
                {id: __id+'y'+i, value: 10, factor: mod.factorize(10), nested: false},
                {id: __id+'z'+i, value: 15, factor: mod.factorize(15), nested: false},
                ]
        }})
    }
}
</script>
