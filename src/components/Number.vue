<template>
    <div class="flex">
        <div class="math--object" @click='showFactor=!showFactor'>
            <div class="object-value object-margin">
                {{numberProp.value}}
            </div>
            <div class='object-factor' v-if="showFactor">
                <div v-for="(X, index) in numberProp.factor" :key="index">
                    {{X}}
                </div>
            </div>
        </div>
        <div class="flex" v-if="showNest" >
            <div @click="multiply">{{numberProp.op}}</div> 
            (
            <div class="flex " v-for="(num, index) in numberProp.nested" :key="index">
                <div class="object-value " @click='add(num.id)' v-if="showOp(index, num.sign)">
                        {{num.sign}}
                </div>
                <number :numberProp='num'/>
            </div>
            )
        </div>      
    </div>
</template>

<script>
'use strict'
import { EventBus } from "../assets/JS/event-bus";
// import state from "../assets/JS/event-handler"

export default {
    name: 'number',
    props: ['numberProp', 'functions'],
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
            // console.group('showOp')
            // console.log(i)
            // console.log(this.numberProp.nested[i].op)
            // console.groupEnd()
            return i!==0 || (i===0 && sign !== '+')
        },          
    },
    computed: {
        showNest(){
            if(this.numberProp.length < 1) return false
            return this.numberProp.nested.length > 0 ? true : false
        }
    },
    created(){
    }
}
</script>

