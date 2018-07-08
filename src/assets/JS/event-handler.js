'use strict'

import { EventBus } from "./event-bus";
import {Store} from "./state-store";
import { Num, NumObj } from "./number-object"
import mod from "./methods"

//move this to methods/util, same with all functions
function getState(target = false){
    //get Store.target if there is one to control edit state
    let p = Store.numArray
    let len = p.length
    let lastNum = len > 0 ? p[len - 1] : false
    lastNum = target || lastNum
    return {
        empty: !!target || len < 1,
        last: {
            hasValue: lastNum.value !== false,
            isParentheses: lastNum.parentheses,
            hasNest: lastNum && lastNum.getLast() ? true : false,
            lastNum: lastNum,
            isFraction: lastNum && lastNum.op === '/' ? true : false
        },
        p: p
    }
}

function addNumber(n = 'notSet'){
    let S = getState()
    let p = Store.numArray
    let len = p.length
    let lastNum = S.last.lastNum
    if (n === 'notSet' || Store.target) return
    if(S.empty){
        p.push(new NumObj(n, '+'))//.changeOp('+'))
        console.log(p[0])
    }else if(!S.last.isParentheses){
        console.log(n)
        lastNum.addValue(n)
        console.log(lastNum)
    }else if(lastNum.parentheses){
        if(S.last.hasNest){
            lastNum.getLast().addValue(n)
        }else{
            lastNum.nested.push(new NumObj(n, '+'))
        }
    }
    console.log(lastNum)
}

function addParentheses(state = false){
    let S = getState()
    let p = Store.numArray
    let len = p.length
    let lastNum = S.last.lastNum 
    if(state === false) return
    if(state === 'start' && S.last.isFraction && S.last.hasValue){
        Store.parentheses = !Store.parentheses
        return
    }
    if (state === 'start' && !S.last.hasNest){
        if(!S.last.hasValue){
            lastNum.parentheses = true
        } else if (S.last.hasValue){
            addOperator('*')
            p[len].parentheses = true  
        }
    } else if (state === 'end' && S.last.isParentheses){
        if (S.last.hasNest) {
            lastNum.getLast().value === false ? lastNum.nested.pop() : false
        }
        if(p[len-1].nested.length < 1){
            p[len-1].parentheses = false;
        }
    }
}

function addOperator(o = 'notSet'){
    let S = getState()
    let p = Store.numArray
    let len = p.length
    let lastNum = S.last.lastNum
    if (o === 'notSet' || Store.target) return
    if(S.empty){
        p.push(new NumObj('notSet', o))
    } else if (!Store.parentheses){
        if (!S.last.hasValue && !S.last.hasNest){
            lastNum.changeOp(o)
        }else{
            p.push(new NumObj('notSet', o))
        }
    } else if (Store.parentheses && S.last.isParentheses){
        let lastNest = lastNum.getLast()
            if(S.last.hasNest){
                if(lastNest.value === false){
                    lastNest.changeOp(o)
                }else{
                    lastNum.nested.push(new NumObj('notSet', o))
                }
            } else if (lastNum.nested.length < 1){
                lastNum.nested.push(new NumObj('notSet', o))
            }

        }
    console.log(p)
}

function Operator(o = 'notSet') {
    let S = getState()
    let p = Store.numArray
    let lastNum = S.last.lastNum    
    if (o === 'notSet' || Store.target) return
    if (!Store.parentheses) {
        if (!S.last.hasValue && !S.last.hasNest){
            lastNum.changeOp(o)
        } else {
            p.push(new NumObj('notSet', o))
        }
    } else if (Store.parentheses && S.last.isParentheses) {
        let lastNest = lastNum.getLast()
        if (S.last.hasNest) {
            if (lastNest.value === false) {
                lastNest.changeOp(o)
            } else {
                lastNum.nested.push(new NumObj('notSet', o))
            }
        }else if(lastNum.nested.length < 1){
            lastNum.changeOp(o)
        }
    }    
}

export function init() {
    EventBus.$on('enter', x => {
        console.log('enter group')
        console.log(NumObj)
        let S = getState()
        let p = Store.numArray
        if(!S.last.hasValue){
            if (!S.last.hasNest){
                p.pop()
            }else{
                if(S.last.lastNum.getLast().value === false){
                    S.last.lastNum.nested.pop()
                }
                if (!S.last.lastNum.getLast()){
                    p.pop()
                }
            }
        }
        if(!S.empty){

            let n = []
            p.forEach(x=>{
                if (x.value === false && x.nested.length) {
                    n.push(new Num(false, false, '+', x.op))
                    n[n.length-1].addChild(...x.nested.map(y=>{
                        console.log(y)
                        return [y.value, false, '+', y.op]
                    }))
                } else {
                    n.push(new Num(x.value, false, '+', x.op))
                }            
            })
            let m = n.reduce((acc, cur, i)=>{
                //doesnt account for parentheses forced groups, 
                if(['+','-'].includes(cur.op)){
                    console.log('+-')
                    acc.push([cur])
                }else{
                    console.log('*/')
                    acc[acc.length-1].push(cur)
                }
                return acc
            }, [])
            m.forEach(group=>{            
                Store.numbers[0].addExpression(group)
            })
            Store.numbers[0].setParentMethod()
            Store.reset();
        }

        console.log('printing numbers')
        console.log(Store.numbers[0])
    })

    EventBus.$on('undo', x => {
        console.log('undo group')
        let S = getState()
        let p = Store.numArray
        let len = p.length
        let lastNum = S.last.lastNum
        if(S.empty) return
        if(lastNum.parentheses){
            if(S.last.hasNest){
                console.log('parentheses  and has nest')
                lastNum.nested.pop()
                if(lastNum.nested.length < 1){
                    p.pop()
                }
            }else{
                console.log('parentheses  no nest')
                lastNum.parentheses = false;
            }
        }else if(!lastNum.parentheses){
            console.log('not parentheses')
            if(S.last.hasValue){
                lastNum.value = false
            }else{
                p.pop()
            }
        }
        if(p.length > 0 && p[p.length-1].parentheses){
            Store.parentheses = true;
        }else{
            Store.parentheses = false;
        }
    })

    EventBus.$on('btn-parentheses', e => {
        console.log('parentheses group')
        let par = Store.parentheses; 
        if(!par){
            addParentheses('start')
        }else{
            addParentheses('end')
        }
        Store.parentheses = !Store.parentheses
    })

    EventBus.$on('btn-number', x => {
        console.log('number group')
        addNumber(x)
    })

    EventBus.$on('btn-div', x => {
        let S = getState();
        if (x !== '/' || S.empty || S.last.isFraction) return
        console.log('/ group')
        Operator(x)
    })

    EventBus.$on('btn-mul', x => {
        let S = getState();
        let lastNum = S.last.lastNum
        if (x !== '*' || S.empty) return
        if (S.last.isFraction && !S.last.isParentheses && S.last.hasValue){
            let val = lastNum.value
            console.log(lastNum.value)
            lastNum.value = false
            EventBus.$emit('btn-parentheses')
            EventBus.$emit('btn-number', '' + val)
        }
        console.log('* group')
        Operator(x)
    })

    EventBus.$on('btn-add', x => {
        let S = getState();
        if (!['+', '-'].includes(x)) return
        // if (x === '+' && S.empty) return
        console.log('+- group')
        addOperator(x)
    })
}
