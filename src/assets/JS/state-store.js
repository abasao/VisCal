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
    //make util function in method file for generating 3 types of expressions
    createState(){
        let l = this.Store.numbers.length;
        let n = (new Num()).setRoot(l).addChild(...mod.rng(4, 15, 3))
        n.nested = n.nested.map( (x, i) =>{
            // console.log(x)
            x.setProperty('op', Math.random() > 0.7 ? '-' : '+')
            // if(i === 0 && x.op === '+'){
            //     x.op = false;
            // }
            return x
        })
        this.Store.numbers.push(n);
        this.Store.numbers[0].setParentMethod()
    }
}

export {
    State as default, 
}
export const Store = State.Store