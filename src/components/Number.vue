<template>
    <div>
        <!-- implement default component behavior -->        
        <div class="flex" v-if="normal">
            <div class="math--object" @click='showFactor=!showFactor'>
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
            <div class="flex" v-if="showNest" >
                <div @click="doOperation(true, numberProp.op)">
                    {{numberProp.op | operator}}
                </div> 
                <!-- implement parentheses nest -->
                <parentheses :bool='showParentheses'>
                    <div class="flex " v-for="(num, index) in numberProp.nested" :key="index">
                        <div class="object-value " @click='doOperation(num.id, "+")' v-if="showSign(index)">
                            {{num.value | sign}}
                        </div>
                        <div v-else-if="showSign(index, num.value)">
                            <span class="negative-sign" >
                                {{num.value | sign}}
                            </span>
                        </div>
                        <number v-bind="{numberProp: num, functions: num.methods(num)}"/>
                    </div>
                </parentheses>                 
            </div>
        </div>
        <!-- implement fraction component behavior -->
        <div v-else-if="!normal">
            <span>
                //
            </span>
        </div>
        <!-- exponents, algebriac, other implementations ... -->
    </div>    
</template>

<script>
'use strict'
import Parentheses from "./Parentheses";

export default {
    name: 'number',
    props: ['numberProp', 'functions'],
    components: {
        'parentheses': Parentheses
    },
    data(){
        return {
            showFactor: false,
        }
    },
    methods: {
        doOperation(id, op){
            console.log(typeof id)
            console.log(id)
            if(typeof id === 'object' || id === true){
                switch (op) {
                    case '+':
                        this.functions.add(id[id.length-1])
                        break;
                    case '-':
                        this.functions.sub(id[id.length-1])
                        break;
                    case '*':
                        this.numberProp.Commander('multiply')
                        break;
                    case '/':
                        console.log('wait for fraction')
                        break;
                    default:
                        console.log('No operator')
                        break;
                }
            }
            
            return 
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
    },
    computed: {
        showParentheses(){
            if(this.numberProp.nested.length > 1){
                return true
            }else if(this.numberProp.nested.length === 1 && this.numberProp.nested[0].value < 0){
                return true
            }

            return false
        },
        showNest(){
            if(this.numberProp.nested.length < 1) return false
            return this.numberProp.nested.length > 0
        },
        normal(){
            return true
        }
    },
    filters: {
        sign(x){
            return x < 0 ? '−' : '+'
        },
        absolute(value){
            return value >= 0 ? value : Math.abs(value)
        },
        operator(op){
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
                    operator = '×';
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
</style>

