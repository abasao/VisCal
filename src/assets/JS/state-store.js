'use strict'
import { Num, NumObj } from "./number-object"
import mod from "./methods";

const State = {
    Store: {
        numbers:[],
        numArray: [],
        aN: (new Num()).setRoot('edit'),
        parentheses: false,
        btn: {
            btn_num: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            btn_op: ['+', '-', '*', '/'],
            btn_spec: ['(  )', 'C']
        },
        editorControl: {
            parentheses: true,
            multi_op: true,
            div_op: true,
            pow: false,
        },
        target: false,
        setTarget(T){
            if(this.target.value === 1){

            }else if(this.target.value === false){
                
            }
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