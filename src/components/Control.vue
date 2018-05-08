<template>
    <div class="control flex-col control-style btn-style cursor">
        <div class="control--row flex">
            <div class="margin-h btn-value btn-top btn-style">←</div>
            <div class="margin-h btn-value btn-top btn-style" @click='enterEvent'>Enter</div>
            <div class="margin-h btn-value btn-top btn-style">→</div>
        </div>
        <div class="control--row flex" v-for="(btnRow, iRow) in btnArray" :key="iRow">
            <div v-for="(btn, iBtn) in btnRow" :key="iBtn">
                <div class="control--btn margin-h margin-v btn-style flex"
                @click="btnClick(btn, $event)">
                    <span class="btn-value">
                        {{btn}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
'use strict'
import { EventBus } from "../assets/JS/event-bus";

export default {
    data(){
        return {
            btnArray: [
                ['×', '÷', '(  )', '^'],
                ['7', '8', '9', '−'],
                ['4', '5', '6', '+'],
                ['1', '2', '3', '0']
            ],
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
                        EventBus.$emit('btn-op', '*', e);
                        break;
                    case '÷':
                        EventBus.$emit('btn-op', '/', e);
                        break;
                    case '−':
                        EventBus.$emit('btn-op', '-', e);
                        break;
                    default:
                        EventBus.$emit('btn-op', '+', e);
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
        }
    }
}
</script>

