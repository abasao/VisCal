<template>
<div>
  <div class="math cursor control preview-style">
      <div class="btn-style btn-value" v-if="aN.value">
          {{aN.value}}
      </div>
      <div class="btn-style" v-if="typeof aN.nested === 'object' && aN.nested.length > 0">
        × (
            <span class="btn-value" v-for="(n, i) in aN.nested" :key="i">
                {{n}}
                <span class="btn-value margin-h" v-if="i + 1 < aN.nested.length">
                    +
                </span>
            </span>
        )
      </div>
  </div>
  <div class="math margin-v">
      <div class="term-flex term-style cursor" v-for="(num, index) in numbers" :key="index">
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
import state from "../assets/JS/event-handler"
import { Num } from "../assets/JS/number-object"
export default {
    data (){
        return {
            numbers: [],
            default: {value: false, nested: false, sign: '+', op: '×'},
            aN: {value: false, nested: false, sign: '+', op: '×'},
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
        // state.state_exp = {
        //     name: 'expression component',
        //     size: 'long list array'
        // }
        // this.aN = Object.assign({}, this.default);
        this.numbers = mod.rng(2, 10, 2).map((num, i) => { 
            let newNum = new Num(num, [i]);
            return newNum.addChild(10,15,5)
        })
    },
    mounted () {
        EventBus.$on('addNext', id => {
            let current = id.pop();
            let obj = mod.finder(this.numbers, id);
            obj[current].value += obj[current+1].value;
            obj[current].factor = mod.factorize(obj[current].value);
            obj.splice(current+1, 1);
            obj.forEach((x,i)=>{
                let oldId = [...x.id];
                x.id.pop(); 
                x.id.push(i);
            })
        })

        EventBus.$on('multiply', id => {
            let obj = mod.finder(this.numbers, id);
            let multiplier = obj.value;
            obj.value = 1;
            obj.nested.forEach(x => {
                x.value *= multiplier;
                x.factor = mod.factorize(x.value);
            });
        })

        EventBus.$on('enter', x => {
            if(!this.aN.value) return
            if(this.aN.value){
                let newNum = new Num(this.aN.value, [this.numbers.length]);
                if(typeof this.aN.nested === 'object'){
                    newNum.addChild(...this.aN.nested)
                }
                this.numbers.push(newNum)
                this.aN = {value: false, nested: false}
            }
        })

        EventBus.$on('btnNumber', x => {
            let p = this.aN;
            let n = this.aN.nested;
            if(p.value === false){
                p.value = x;
            }else if(!n){
                p.value += x;
            }else if(n === true || typeof n === 'object'){
                console.log('nest is now true')
                n = [1,2,3,4]
                // if(typeof n === "object"){//last part not needed
                //     console.log('increase nest')
                //     n.splice(n.length-1, 1, n[n.length-1]+x);
                // }else {
                //     console.log(x)
                //     n = [1,2,3];
                //     console.log(n.length, typeof n)
                // }
            }
        })
        EventBus.$on('btnOp', x => {
            if(!['+', '−'].includes(x) && this.aN.value === false) return
            if(['+', '−'].includes(x) && this.aN.value === false){
                console.log('yeah')
                this.aN.sign = x;
            }else if(['×', '÷'].includes(x) && this.aN.nested === false){
                console.log('change nest to true')
                this.aN.op = x;
                this.aN.nested = [];
            }else if (typeof this.aN.nested === 'object'){//['+', '−'].includes(x) && 
                console.log('push nest')
                this.aN.nested.push([])
            }
        })     
        // EventBus.$on('btn', x => {
        //     if(this.btn.btn_num.includes(x)){
        //         if(this.aN.value === false){
        //             this.aN.value = x;
        //         }else if(typeof this.aN.value === 'string' && !this.aN.nested){
        //             this.aN.value += x;
        //         }else if(this.aN.value && this.aN.nested){
        //             if(this.aN.nested.length > 0){
        //                 this.aN.nested.splice(0, 1, this.aN.nested[0]+x)                        
        //             }else if(this.aN.nested.length === 0){
        //                 this.aN.nested = [x];
        //             }
        //         }

        //     }else if(this.btn.btn_op.includes(x) && this.aN.value){
        //         if(!this.aN.nested) {
        //           this.aN.nested = [];
        //         }else if(typeof this.aN.nested[0] === 'string'){
        //             this.aN.nested.unshift([])
        //         }
        //     }
        // })
    }    
}
</script>
