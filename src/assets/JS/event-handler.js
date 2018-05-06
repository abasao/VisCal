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
        if(Store.parentheses){
            Store.parentheses = false
        }

        if (p.nested[0].value === 1) return Store.reset()
        //the index remains, while each remove updated nest index
        function sanitize(obj, parent, i = false){
            // console.log('run sanitizer')
            if(obj.value === 1){
                // console.log('marking child for removal')
                obj.setRemove(true);
            }
            else if(obj.nested.length > 0){
                obj.nested.forEach((x, i)=>{
                    sanitize(x, obj, i)
                })
            }   
        }

        sanitize(p,0)
        p.clearRemoved().toInt().evaluateSign()
        Store.numbers[0].addExpression(p.nested)
        Store.reset();        
        // console.log('return from enter')
        // console.groupEnd()
        return
    })

    //Parentheses group
    EventBus.$on('btnSpec', x => {
        if (x === 'C') return

        let p = Store.aN;
        let pLen = p.nested.length;
        if (pLen === 0) return
        console.group('Parentheses group')
        console.log('entering Spec')
        if (!Store.parentheses && p.nested[pLen - 1].nested.length === 0) {
            p.nested[pLen - 1].addChild(1).setProperty('nestOp', '*', true);
            Store.parentheses = !Store.parentheses;
        } else if (Store.parentheses && p.nested[pLen - 1].nested.length > 0) {
            if (p.nested[pLen - 1].nested.slice(-1)[0].value === 1) {
                p.nested[pLen - 1].nested.pop()
            }
            Store.parentheses = !Store.parentheses;
        }
        console.log(Store.parentheses)
        console.groupEnd()
    })    

    //for Parentheses
    EventBus.$on('btnNumber', x => {
        if (!Store.parentheses) return

        let p = Store.aN;
        let nestLen = p.nested.length;
        console.group('parentheses number group')
        console.log('the nest')
        let n = p.nested[nestLen-1].nested;
        let len = n.length;
        if (n[len - 1].value === 1) {
            console.log('has value 1')
            n[len - 1].value = x;
            console.log(n)
        } else if (typeof n[len - 1].value === 'string') {
            console.log('has string value')
            n[len - 1].value += x;
            console.log(n)
        }
        console.groupEnd()
    })

    EventBus.$on('btnNumber', x => {
        if (Store.parentheses) return

        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen - 1] : false;
        console.group('number group')
        //correcting for false nestOp
        if (nestLen === 0) {
            console.log('add child')
            p.addChild(x)
            // if (nestLen > 0) {
            //     p.nested[nestLen].setProperty('op', p.nested[nestLen - 1].nestOp);
            //     p.nested[nestLen - 1].nestOp = false;
            // }
            console.log(lastNum)
        } else if (lastNum.nestOp !== false &&
                    lastNum.nested.length === 0){
            console.log('add sibling')
            lastNum.addSibling(x)
            console.log(lastNum)         
        } else if (lastNum.nested.length === 0) {
            console.log('add digit')
            if (lastNum.value === 1) {
                lastNum.value = '';
            }
            lastNum.value += x;
            console.log(lastNum)
        }
        console.groupEnd()
    })

    //for ['+', '-']
    EventBus.$on('btnOp', x => {
        if (!['+', '-'].includes(x) || !Store.parentheses) return

        let p = Store.aN;
        let pLen = p.nested.length;
        console.group('parentheses + or - group')
        let len = p.nested[pLen - 1].nested.length;
        if (p.nested[pLen - 1].nested[len - 1].value === 1) {
            console.log('change child sign to: ' + x)
            p.nested[pLen - 1].nested[len - 1].sign = x;
        } else if (typeof p.nested[pLen - 1].nested[len - 1].value === 'string') {
            console.log('add extra child in nest')
            p.nested[pLen - 1].addChild([1, false, x])
        }
        console.groupEnd()
    })

    EventBus.$on('btnOp', x => {
        if (!['+', '-'].includes(x) || Store.parentheses) return

        let p = Store.aN;
        let pLen = p.nested.length;
        console.group('+ or - group')
        if (pLen === 0) {
            console.log('first sibling sign')
            p.addChild(1).nested[0].sign = x;
            console.log(p.nested[0])
        } else {
            if (!p.nested[pLen - 1].nestOp) {
                if (p.nested[pLen - 1].value === 1) {
                    console.log('changing sibling sign')
                    p.nested[pLen - 1].sign = x;
                } else if (typeof p.nested[pLen - 1].value === 'string') {
                    console.log('add sibling')
                    p.addChild([1, false, x]);
                }
            }
        }
        console.groupEnd()
    })

    //for ['*', '/']
    EventBus.$on('btnOp', x => {
        let p = Store.aN;
        let pLen = p.nested.length;
        if (!['*', '/'].includes(x) || pLen === 0 || Store.parentheses) return
        console.group('Op group')
        //later: just check parentheses, otherwise allow deep nesting?
        if (p.nested[pLen - 1].nested.length === 0) {
            console.log('changing operator')
            // p.nested[pLen-1].nestOp = x;
            p.nested[pLen - 1].setProperty('nestOp', x);
            // console.log(p.nested[pLen-1].nestOp)
        }
        console.groupEnd()
    })    
    /*

    EventBus.$on('btnSpec', x => {
        if(x === 'C') return
        let p = Store.aN;
        let pLen = p.nested.length;
        if(pLen === 0) return
        console.group('Parentheses group')
        console.log('entering Spec')
        if(!Store.parentheses && p.nested[pLen - 1].nested.length === 0){
            p.nested[pLen - 1].addChild(1).setProperty('nestOp', '*', true);
            Store.parentheses = !Store.parentheses;
        } else if (Store.parentheses && p.nested[pLen - 1].nested.length > 0){
            if (p.nested[pLen - 1].nested.slice(-1)[0].value === 1){
                p.nested[pLen - 1].nested.pop()
            }
            Store.parentheses = !Store.parentheses;
        }
        console.log(Store.parentheses)
        console.groupEnd()
    })

    //for Parentheses
    EventBus.$on('btnNumber', x => {
        if (!Store.parentheses) return
        let p = Store.aN;
        let nestLen = p.nested.length;
        console.group('parentheses number group')
        console.log('the nest')
        let n = p.nested[nestLen-1].nested;
        let len = n.length;
        if (n[len - 1].value === 1) {
            console.log('has value 1')
            n[len - 1].value = x;
            console.log(n)
        } else if (typeof n[len - 1].value === 'string') {
            console.log('has string value')
            n[len - 1].value += x;
            console.log(n)
        }
        console.groupEnd()
    })

    EventBus.$on('btnNumber', x => {
        if (Store.parentheses) return
        let p = Store.aN;
        let nestLen = p.nested.length;
        console.group('number group')
        if (p.nested.length === 0 || p.nested[nestLen - 1].nestOp !== false && 
            p.nested[nestLen - 1].nested.length === 0) {
            console.log('add child')
            p.addChild(x)
            if(nestLen > 0){
                p.nested[nestLen].setProperty('op', p.nested[nestLen-1].nestOp);
                p.nested[nestLen - 1].nestOp = false;
            }
            console.log(p.nested[nestLen])
        } else if (p.nested[nestLen - 1].nested.length === 0) {
            console.log('add digit')
            if (p.nested[nestLen - 1].value === 1) {
                p.nested[nestLen - 1].value = '';
            }
            p.nested[nestLen - 1].value += x;
            console.log(p.nested[nestLen - 1])
        }
        console.groupEnd()
    })

    //for ['+', '-']
    EventBus.$on('btnOp', x => {
        let p = Store.aN;
        let pLen = p.nested.length;
        if (['*', '/'].includes(x) || !Store.parentheses) return
        console.group('parentheses + or - group')
        let len = p.nested[pLen - 1].nested.length;
        if (p.nested[pLen - 1].nested[len - 1].value === 1) {
            console.log('change child sign to: ' + x)
            p.nested[pLen - 1].nested[len - 1].sign = x;
        } else if (typeof p.nested[pLen - 1].nested[len - 1].value === 'string') {
            console.log('add extra child in nest')
            p.nested[pLen - 1].addChild([1, false, x])
        }
        console.groupEnd()        
    })

    EventBus.$on('btnOp', x => {
        let p = Store.aN;
        let pLen = p.nested.length;
        if (['*', '/'].includes(x) || Store.parentheses) return
        console.group('+ or - group')
        if (['+', '-'].includes(x) && pLen === 0) {
            console.log('first sibling sign')
            p.addChild(1).nested[0].sign = x;
            console.log(p.nested[0])
        }else{
            if (!p.nested[pLen - 1].nestOp) {
                if (p.nested[pLen - 1].value === 1) {
                    console.log('changing sibling sign')
                    p.nested[pLen - 1].sign = x;
                } else if (typeof p.nested[pLen - 1].value === 'string') {
                    console.log('add sibling')
                    p.addChild([1, false, x]);
                }
            }         
        }
        console.groupEnd()
    })

    //for ['*', '/']
    EventBus.$on('btnOp', x => {
        let p = Store.aN;
        let pLen = p.nested.length;
        if (['+', '-'].includes(x) || pLen === 0 || Store.parentheses) return
        console.group('Op group')
        //later: just check parentheses, otherwise allow deep nesting?
        if (['*', '/'].includes(x) && p.nested[pLen-1].nested.length === 0) {
            console.log('changing operator')
            // p.nested[pLen-1].nestOp = x;
            p.nested[pLen-1].setProperty('nestOp', x);
            // console.log(p.nested[pLen-1].nestOp)
        }
        console.groupEnd()
    })
    */
}
