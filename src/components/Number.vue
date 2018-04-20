<template>
    <div class="flex">
        <div class="math--object" @click='showFactor=!showFactor'>
            <!-- actual number value -->
            <div class="object-value object-margin">
                {{numberProp.value}}
            </div>
            <!-- Factor column/row -->
            <div class='object-factor' v-if="showFactor">
                <div v-for="(X, index) in numberProp.factor" :key="index">
                    {{X}}
                </div>
            </div>
        </div>
        <div class="flex" v-if="showNest" >
            <div @click="multiply">{{numberProp.op}}</div> 
            
            <parentheses :bool='showParentheses'>              
            <div class="flex " v-for="(num, index) in numberProp.nested" :key="index">
                <div class="object-value " @click='add(num.id)' v-if="showOp(index, num.sign)">
                        {{num.sign}}
                </div>
                <number v-bind="{numberProp: num, functions: num.methods(num)}"/>
            </div>
            </parentheses>              
            
        </div>      
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
        add(id){
            this.functions.add(id[id.length-1])
        },
        multiply(){
            this.numberProp.Commander('multiply')
        },
        showOp(i, sign){
            return i!==0 || (i===0 && sign !== '+')
        },
    },
    computed: {
        showParentheses(){
            if(this.numberProp.nested.length > 1){
                return true
            }else if(this.numberProp.nested[0].sign !== '+'){
                return true
            }

            return false
        },
        showNest(){
            if(this.numberProp.length < 1) return false
            return this.numberProp.nested.length > 0
        }
    },
}
</script>

