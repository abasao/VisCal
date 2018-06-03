<template>
    <div :class="{'item-style': !root}">
        <!-- implement default component behavior -->        
        <!-- <div class="" v-if="normal" :class="{flex: root, flex: !root, fr: showFraction, lmao: !true}"> -->

            <!-- Number value -->
            <div class="math--object" @click='showFactor=!showFactor' v-if="numberProp.value">
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
            <!-- fraction -->
            <div class="flex" v-else-if="false && hasNest">
                <!-- <div @click="doOperation(true, numberProp.nestOp)" :hidden='root'>
                    {{numberProp.nestOp | operator}}
                </div> -->
                <!-- implement parentheses nest -->
                <!-- <parentheses :bool='showParentheses'>
                    <div class="flex " v-for="(frNum, index) in numberProp.nested" :key="index">
                        <div class="object-value " @click='doOperation(frNum.id, "+")' v-if="showSign(index)">
                            {{frNum.value | sign}}
                        </div>
                        <div v-else-if="showSign(index, frNum.value)">
                            <span class="negative-sign" >
                                {{frNum.value | sign}}
                            </span>
                        </div>
                        <number v-bind="{numberProp: frNum, functions: frNum.methods(), root: false}"/>
                    </div>
                </parentheses> -->
            </div>

    </div>
</template>

<script>
'use strict'
import Parentheses from "./Parentheses";

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
            if(i !== false){
                this.numberProp.Commander(i)
                // switch (op) {
                //     case '+':
                //         this.functions.add(id[id.length-1])
                //         break;
                //     case '-':
                //         this.functions.sub(id[id.length-1])
                //         break;
                //     case '*':
                //         this.numberProp.Commander('multiply')
                //         break;
                //     case '/':
                //         console.log('wait for fraction')
                //         break;
                //     default:
                //         console.log('No operator')
                //         break;
                // }
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

