'use strict'
import { Num } from "./number-object"
import mod from "./methods";

const State = {
    Store: {
        numbers:[],
        aN: (new Num()).setRoot('edit'),
        parentheses: false,
        btn: {
            btn_num: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            btn_op: ['+', '-', '*', '/'],
            btn_spec: ['(  )', 'C']
        },
        reset(){
            this.aN.nested = [];
        }      
    },
    stateHistory: {},
    mutations: {
        createState(){
        },
        
    },

    createState(){
        let l = this.Store.numbers.length;
        let n = (new Num()).setRoot(l).addChild(...mod.rng(2, 10, 2))
        this.Store.numbers.push(n);
    }
}

export {
    State as default, 
}
export const Store = State.Store