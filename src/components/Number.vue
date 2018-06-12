<template>
    <div :class="{'item-style': !root}">
        <!-- implement default component behavior -->        
            <!-- Number value -->
            <div class="math--object" @click='clickNum' v-if="numberProp.value">
                <!-- actual number value -->
                <div class="object-value object-margin">
                    {{numberProp.value | absolute}}
                </div>
                <!-- Factor column/row -->
                <div class='object-factor' v-if="showFactor">
                    <div v-for="(X, index) in numberProp.factor" :key="index">
                        {{X}}
                    </div>
                </div>
            </div>
            <!-- Nest no fraction -->
            <div class="flex" v-else-if="hasNest">
                <parentheses :bool='showParentheses'>
                    <div class="flex " v-for="(num, index) in numberProp.nested" :key="index">
                        <div class="object-value" v-if="num.op" @click="doOperation(index)">
                            {{num.op, index | operator}}
                        </div>
                        <number v-bind="{numberProp: num, functions: num.methods(), root: false}"/>
                    </div>
                </parentheses>
            </div>
    </div>
</template>

<script>
'use strict'
import Parentheses from "./Parentheses";
import { Store } from "../assets/JS/state-store";

export default {
    name: 'number',
    props: ['numberProp', 'functions', 'root'],
    components: {
        'parentheses': Parentheses
    },
    data(){
        return {
            showFactor: false,
        }
    },
    methods: {
        doOperation(i = false){
            if(i !== false && !Store.expand && !Store.compress){
                if(i===0 && !this.numberProp.nested[i].getNest()) return
                this.numberProp.Commander(i)
            }else if(i !== false && Store.expand){
                console.log('expantion is online')
            }else if(i !== false && Store.compress){
                console.log('compression is online')
            }
            return 
        },
        clickNum(){
            if (!Store.expand && !Store.compress) {
                this.showFactor = !this.showFactor
            }else if(Store.expand){
                console.log('number expantion is online')
                this.showFactor = false;
            }else if(Store.compress){
                console.log('number compression is online')
            }
        },
        add(id){
            this.functions.add(id[id.length-1])
        },
        multiply(){
            this.numberProp.Commander('multiply')
        },
        showSign(i,...value){
            if(typeof i === 'number' && value.length === 0){  
                return i!==0
            }
            return i === 0 && value[0] < 0
        },
        fraction(i=0){
            if(this.numberProp.nested.length > 0){
                return this.numberProp.nested[i+1].op === '/'
            }
            return false
        }
    },
    computed: {
        showParentheses(){
            if(this.root === true) return false
            return this.numberProp.nested.some((x,i)=>{
                if(i === 0 && x.op === '-'){
                    return true
                }else if(i !== 0){
                    return x.op !== '*'
                }
            })
        }, 
        hasNest(){
            return this.numberProp.nested.length > 0
        },
        normal(){
            return true
        },
    },
    filters: {
        sign(x){
            return x < 0 ? '−' : '+'
        },
        absolute(value){
            return value >= 0 ? value : Math.abs(value)
        },
        operator(op, i){
            if(i === 0 && op === '+') return ''
            let operator = false;
            switch (op) {
                case '*':
                    operator = '×';
                    break;
                case '/':
                    operator = '÷';
                    break;
                case '+':
                    operator = '+';
                    break;
                case '-':
                    operator = '−';
                    break;
            
                default:
                    operator = '';
                    break;
            }
            return operator
        }
    }
}
</script>
<style lang="scss">
.negative-sign {
    opacity: 0.3;
}
.lol{
    border: 2px solid red;
}
.fr{
    border: 2px solid blue;
    display: flex;
    flex-direction: column!important;
    // flex-wrap: wrap;
}
</style>

