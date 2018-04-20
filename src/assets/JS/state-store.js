'use strict'
import { Num } from "./number-object"
import mod from "./methods";

const State = {
    Store: {
        numbers:[],
        default: { value: false, nested: false, sign: '+', op: '×' },
        aN: { value: false, nested: false, sign: '+', op: '×' },
        btn: {
            btn_num: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            btn_op: ['+', '−', '×', '÷'],
            btn_spec: ['(  )', 'C']
        },
        reset(){
            this.aN = Object.assign({}, this.default)
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

        // this.Store.numbers = mod.rng(2, 10, 2).map((num, i) => {
        //     let newNum = new Num(num, [i]);
        //     return newNum.addChild(10, 15, 5)
        // })
    }
}

export {
    State as default, 
}
export const Store = State.Store