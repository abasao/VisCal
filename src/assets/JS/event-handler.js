'use strict'

import { EventBus } from "./event-bus";
import {Store} from "./state-store";
import { Num } from "./number-object"
import mod from "./methods"

export function init(){
    EventBus.$on('enter', x => {
        // console.group('enter group')
        let p = Store.aN
        // console.log(p)
        if (p.nested[0].value === 1) return Store.reset()
        //the index remains, while each remove updated nest index
        function sanitize(obj, parent, i = false){
            console.log('run sanitizer')
            if(obj.value === 1){
                console.log('marking child for removal')
                obj.setRemove(true);
                // parent.removeChild(obj.id[obj.id.length-1])
            }
            else if(obj.nested.length > 0){
                obj.nested.forEach((x, i)=>{
                    sanitize(x, obj, i)
                })
            }   
        }

        sanitize(p,0)
        p.nested[0].clearRemoved()
        // console.log(p)

        Store.numbers[0].addExpression(...p.nested)
        Store.reset();        
        console.log('return from enter')
        // console.groupEnd()
        return
    })
    EventBus.$on('btnNumber', x => {
        let p = Store.aN;

        console.group('number group')        
        if (p.nested.length === 0) {
            console.log('add child')            
            p.addChild(x);
            console.log(p)
        } else if (p.nested[0].nested.length === 0) {
            console.log('add digit')
            if (p.nested[0].value === 1){
                p.nested[0].value = '';
            }
            p.nested[0].value += x;
            console.log(p.nested[0])
        } else if (p.nested[0].nested.length > 0) {
            console.log('the nest')
            let n = p.nested[0].nested;
            let len = n.length;
            if(n[len-1].value === 1){
                console.log('has value 1')
                n[len - 1].value = x;
                console.log(n)
            } else if (typeof n[len - 1].value === 'string'){
                console.log('has string value')
                n[len - 1].value += x;
                console.log(n)
            }
        }
        console.groupEnd()
    })

    EventBus.$on('btnOp', x => {
        let p = Store.aN
        console.group('Op group')
        if (['×', '÷'].includes(x) && p.nested.length === 0) return
        if (['+', '−'].includes(x) && p.nested.length === 0) {
            console.log('sign')
            p.addChild(1).nested[0].sign = x;
            console.log(p.nested[0])
        } else if (['×', '÷'].includes(x) && p.nested[0].nested.length === 0) {
            console.log('changing operator')
            p.nested[0].op = x;
            p.nested[0].addChild(1);
            console.log(p.nested[0].op)
        } else if (['+', '−'].includes(x) && p.nested[0].nested.length > 0 ) {
            console.log('inside +/- operator')
            let len = p.nested[0].nested.length;
            if (p.nested[0].nested[len-1].value === 1){
                if(len === 1){
                    console.log('changing sign on first nest')
                    p.nested[0].nested[0].sign = x;
                    console.log(p.nested[0].nested[0].sign)
                }
                return
            } else if (p.nested[0].nested[len-1].value !== 0){
                console.log('creating extra nest')
                p.nested[0].addChild([1, false, x])
                console.log(p.nested[0].nested)
            }
        }
        console.groupEnd()
    })  

}
