<template>
    <div class="control flex-col control-style btn-style cursor">
        <div class="control--row flex">
            <!-- ←  → -->
            <div class="margin-h btn-value btn-top btn-style" @click='undoEvent'><i class="fas fa-eraser"></i></div>
            <div class="margin-h btn-value btn-top btn-style cancel"><i class="fas fa-trash-alt"></i></div>
            <div class="margin-h btn-value btn-top btn-style accept" @click='enterEvent'><i class="fas fa-check"></i></div>
        </div>
        <div class="control--row flex-col">
            <div class="flex">
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('expand', $event)">
                    <span class="btn-value"><i class="fas fa-expand"></i></span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('compress', $event)">
                    <span class="btn-value"><i class="fas fa-compress"></i></span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('highlight', $event)">
                    <span class="btn-value"><i class="far fa-lightbulb"></i></span></div>
            </div>            
            <div class="flex">
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('×', $event)">
                    <span class="btn-value">×</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('÷', $event)">
                    <span class="btn-value">÷</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" :class="parenthesesState" @click="btnClick('(  )', $event)">
                    <span class="btn-value">(  )</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('^', $event)">
                    <span class="btn-value"><i class="fas fa-superscript"></i></span></div>
            </div>
            <div class="flex">
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('7', $event)">
                    <span class="btn-value">7</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('8', $event)">
                    <span class="btn-value">8</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('9', $event)">
                    <span class="btn-value">9</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('−', $event)">
                    <span class="btn-value">−</span></div>
            </div>
            <div class="flex">
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('4', $event)">
                    <span class="btn-value">4</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('5', $event)">
                    <span class="btn-value">5</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('6', $event)">
                    <span class="btn-value">6</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('+', $event)">
                    <span class="btn-value">+</span></div>
            </div>
            <div class="flex">
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('1', $event)">
                    <span class="btn-value">1</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('2', $event)">
                    <span class="btn-value">2</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('3', $event)">
                    <span class="btn-value">3</span></div>
                <div class="control--btn margin-h margin-v btn-style flex" @click="btnClick('0', $event)">
                    <span class="btn-value">0</span></div>
            </div>
        </div>
    </div>
</template>

<script>
'use strict'
import { EventBus } from "../assets/JS/event-bus";
import { Store } from "../assets/JS/state-store";
export default {
    data(){
        return {
            btn_num: ['0', '1', '2', '3','4', '5', '6','7', '8', '9'],
            btn_op: ['+', '−', '×', '÷'],
            btn_spec: [ '(  )', '^']            
        }
    },
    methods: {
        btnClick(btn, e){
            if(this.btn_num.includes(btn)){
                EventBus.$emit('btn-number', btn, e);
            }else if(this.btn_op.includes(btn)){
                switch (btn) {
                    case '×':
                        EventBus.$emit('btn-mul', '*', e);
                        break;
                    case '÷':
                        EventBus.$emit('btn-div', '/', e);
                        break;
                    case '−':
                        EventBus.$emit('btn-add', '-', e);
                        break;
                    default:
                        EventBus.$emit('btn-add', '+', e);
                        break;
                }
            }else if(this.btn_spec.includes(btn)){
                if(btn === '^'){
                    EventBus.$emit('btn-pow', btn, e)
                }else{
                    EventBus.$emit('btn-parentheses', e)
                }
            }                
        },

        enterEvent(){
            EventBus.$emit('enter', 'nothing')
        },
        undoEvent(){
            EventBus.$emit('undo', 'nothing')
        }        
    },
    computed: {
        parenthesesState(){
            return Store.parentheses ? 'btn-parentheses': ''
        }
    }
}
</script>

