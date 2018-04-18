<template>
<div>
  <div class="math cursor control preview-style">
      <div class="btn-style btn-value" v-if="store.aN.value">
          {{aN.value}}
      </div>
      <div class="btn-style" v-if="typeof store.aN.nested === 'object' && store.aN.nested.length > 0">
        × (
            <span class="btn-value" v-for="(n, i) in store.aN.nested" :key="i">
                {{n}}
                <span class="btn-value margin-h" v-if="i + 1 < store.aN.nested.length">
                    +
                </span>
            </span>
        )
      </div>
  </div>
  <div class="math margin-v">
      <div class="term-flex term-style cursor" v-for="(num, index) in store.numbers" :key="index">
            <div class="object-style" v-if="showOp(index, num.sign)">
                <span class="btn-value">{{num.sign}}</span>
            </div>
            <number class="object-style object-hover margin-h" v-bind="{numberProp: num, functions: num.methods(num)}"/>
      </div>
  </div>
</div>
</template>

<script>
'use strict'
import { EventBus } from "../assets/JS/event-bus";
import NumberComp from "./Number";
import mod from "../assets/JS/methods";
import {Store} from "../assets/JS/state-store";
import { Num } from "../assets/JS/number-object";

export default {
    data (){
        return {
            store: {},
            numbers: Store.numbers,
            default: {value: false, nested: false, sign: '+', op: '×'},
            aN: Store.aN,
            btn: {
                btn_num: ['0', '1', '2', '3','4', '5', '6','7', '8', '9'],
                btn_op: ['+', '−', '×', '÷'],
                btn_spec: [ '(  )', 'C']
            }
        }
    },
    methods: {
        showOp(i, sign){
            return i!==0 || (i===0 && sign !== '+')
        },         
    },
    computed: {
    },
    components: {
        'number': NumberComp,
    },
    created (){
        this.store = Store;
    },
    mounted () {
    }
}
</script>
