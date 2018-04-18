'use strict'

import { EventBus } from "./event-bus";
import {Store} from "./state-store";
import { Num } from "./number-object"

export function init(){

    EventBus.$on('enter', x => {
        let p = Store.aN
        if (!p.value) return
        if (p.value) {
            let newNum = new Num(p.value, [Store.numbers.length]);
            if (typeof p.nested === 'object') {
                newNum.addChild(...p.nested)
            }
            Store.numbers.push(newNum)
            Store.reset();
        }
    })

    EventBus.$on('btnNumber', x => {
        let p = Store.aN;
        if (p.value === false) {
            p.value = x;
        } else if (!p.nested) {
            p.value += x;
        } else if (p.nested) {
            if (typeof p.nested === "object") {//last part not needed
                let n = p.nested.length;
                p.nested.splice(n - 1, 1, p.nested[n - 1] + x);
            } else if (p.nested === true) {
                p.nested = [x];
            }
        }
    })

    EventBus.$on('btnOp', x => {
        let p = Store.aN
        if (!['+', '−'].includes(x) && p.value === false) return
        if (['+', '−'].includes(x) && p.value === false) {
            p.sign = x;
        } else if (['×', '÷'].includes(x) && p.nested === false) {
            p.op = x;
            p.nested = true;
        } else if (['+', '−'].includes(x) && typeof p.nested === 'object') {//['+', '−'].includes(x) && 
            p.nested.push([])
        }
    })    
}
