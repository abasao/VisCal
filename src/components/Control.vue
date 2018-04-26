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
                @click="btnClick(btn)">
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
                ['×', '÷', '(  )', 'C'],
                ['7', '8', '9', '−'],
                ['4', '5', '6', '+'],
                ['1', '2', '3', '0']
            ],
            btn_num: ['0', '1', '2', '3','4', '5', '6','7', '8', '9'],
            btn_op: ['+', '−', '×', '÷'],
            btn_spec: [ '(  )', 'C']            
        }
    },
    methods: {
        btnClick(btn){
            if(this.btn_num.includes(btn)){
                EventBus.$emit('btnNumber', btn);
            }else if(this.btn_op.includes(btn)){
                switch (btn) {
                    case '×':
                        EventBus.$emit('btnOp', '*');
                        break;
                    case '÷':
                        EventBus.$emit('btnOp', '/');
                        break;
                    case '−':
                        EventBus.$emit('btnOp', '-');
                        break;
                    default:
                        EventBus.$emit('btnOp', '+');
                        break;
                }
            }else if(this.btn_spec.includes(btn)){
                EventBus.$emit('btnSpec', btn)
            }                
        },

        enterEvent(){
            EventBus.$emit('enter', 'nothing')
        }
    }
}
</script>

