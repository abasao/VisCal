'use strict'

import { EventBus } from "./event-bus";
import {Store} from "./state-store";
import { Num } from "./number-object"

export function init(){
    EventBus.$on('enter', x => {
        let p = Store.aN
        if (!p.value) return

        let nest = typeof p.nested === 'object' ? p.nested.length : false

        if(nest && typeof p.nested[nest-1] === 'object') p.nested.pop()

        let newNum = new Num(parseInt(p.value, 10), [Store.numbers.length]);

        if (nest) {
            p.nested = p.nested.map(num => {
                return parseInt(num, 10)
            });
            newNum.addChild(...p.nested)
        }
        Store.numbers[0].addExpression(newNum)
        Store.reset();
    })

    EventBus.$on('btnNumber', x => {
        let p = Store.aN;
        if (p.value === false) {
            p.value = x;
        } else if (!p.nested) {
            p.value += x;
        } else if (p.nested) {
            if (typeof p.nested === "object") {
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
        } else if (['+', '−'].includes(x) && typeof p.nested === 'object') {
            p.nested.push([])
        }
    })    
}
