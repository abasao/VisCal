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
    let len = p.length
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
        let len = p.length
        let lastNum = S.last.lastNum  
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
                if (x.value === false && x.nested.length > 0) {
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
            console.log(n)
            console.log(m)
            m.forEach(group=>{            
                Store.numbers[0].addExpression(group)
            })
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

export function initPaused(){
    EventBus.$on('enter', x => {
        // console.group('enter group')
        let p = Store.aN
        // console.log(p)
        if(Store.parentheses){
            Store.parentheses = false
        }

        if (p.nested[0].value === 1) return Store.reset()
        //the index remains, while each remove updated nest index
        function sanitize(obj, parent){
            // console.log('run sanitizer')
            if(obj.value === 1){
                // console.log('marking child for removal')
                obj.setRemove(true);
            }
            else if(obj.holder === true){
                if(obj.nested.length > 0){
                    obj.nested.forEach( x =>{
                        sanitize(x, obj)
                    })
                }
                obj.sibling.forEach(x =>{
                    sanitize(x, obj)
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

    //Parentheses start group
    EventBus.$on('btn-parentheses', e => {
        if(Store.parentheses) return
        e.preventDefault()

        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen - 1] : false;
        console.group('Parentheses start group')
        console.log('entering parentheses')
        if (nestLen === 0){
            // if nothing is there
            p.addChild(1)
            let firstNum = p.nested[0];
            console.log('start parentheses and add first sibling')
            firstNum.addSibling(firstNum.value);
            Store.parentheses = true;
        } else if (lastNum && lastNum.value === 1 && !lastNum.nestOp && lastNum.nested.length < 1){
            //if you start with - or + number without changing value
            console.log('start parentheses and add sibling')
            lastNum.addSibling(lastNum.value);
            Store.parentheses = true;
            console.log(lastNum)
        } else if (lastNum.holder) {
            //if you are done with a sibling
            console.log('done with sibling, adding nest')
            if(lastNum.getLast('sibling').value === 1){
                //either by using * or /, which creates value 1 number
                console.log('removing empty sibling')
                lastNum.nestOp = lastNum.getLast('sibling').op;
                lastNum.sibling.pop()
            }else{
                //or by pressing parentheses after a real number
                lastNum.nestOp = '*';
            }

            lastNum.addChild(1)
            Store.parentheses = true;
            console.log(lastNum)

        } else if (lastNum.nested.length === 0) {
            //if your last num has value != 1, nestOp = false
            console.log('creating nest')
            lastNum.addSibling(lastNum.value)
            lastNum.addChild(1).setProperty('nestOp', '*', true);
            Store.parentheses = true;
            console.log(lastNum)
        }
        console.groupEnd()
    })

    //Parentheses end group
    EventBus.$on('btn-parentheses', e => {
        if (!Store.parentheses || e.defaultPrevented) return
        console.log()
        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen - 1] : false;
        if (nestLen === 0) return
        console.group('Parentheses end group')
        console.log('leaving parentheses')
        if (lastNum.nested.length > 0) {
            if (lastNum.getLast('nested').value === 1) {
                lastNum.nested.pop()
            }
            if(lastNum.nested.length < 1 && lastNum.nestOp){
                lastNum.nestOp = false;
            }
            Store.parentheses = false;

        }else if(lastNum.holder){
            if(lastNum.getLast('sibling').value === 1){
                console.log('remove last value 1 sibling')
                lastNum.sibling.pop();
            }
            console.log(lastNum)
            if(lastNum.sibling.length < 1){
                //if you have nothing in Holder object, remove it
                console.log('deleting last empty Holder')
                p.nested.pop()
            }
            Store.parentheses = false;
        }
        console.log(Store.aN.nested)
        console.groupEnd()
    })

    //for Parentheses
    EventBus.$on('btn-number', x => {
        if (!Store.parentheses) return

        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = p.nested[nestLen-1];
        console.group('parentheses number group')

        if(lastNum.holder && lastNum.nested.length < 1){
            //for sibling
            if(lastNum.getLast('sibling').value === 1){
                console.log('changing sibling value from 1 to: ' + x)
                lastNum.getLast('sibling').value = x;
            } else if (typeof lastNum.getLast('sibling').value === 'string'){
                console.log('adding: ' + x + ' to sibling value')
                lastNum.getLast('sibling').value += x;
            }
        }else if(lastNum.holder && lastNum.sibling.length < 1){
            //for nest only
            if (lastNum.getLast('nested').value === 1) {
                console.log('changing nested value from 1 to: ' + x)
                lastNum.getLast('nested').value = x;
            } else if (typeof lastNum.getLast('nested').value === 'string') {
                console.log('adding: ' + x + ' to nested value')
                lastNum.getLast('nested').value += x;
            }
        } else if (lastNum.holder && lastNum.sibling.length > 0){
            if (lastNum.getLast('nested').value === 1) {
                console.log('changing nested value from 1 to: ' + x)
                lastNum.getLast('nested').value = x;
            } else if (typeof lastNum.getLast('nested').value === 'string') {
                console.log('adding: ' + x + ' to nested value')
                lastNum.getLast('nested').value += x;
            }
        }
        console.log(lastNum)
        console.groupEnd()
    })

    EventBus.$on('btn-number', x => {
        if (Store.parentheses) return

        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen - 1] : false;
        if (lastNum && lastNum.holder) return
        console.group('number group')
        if (nestLen === 0) {
            console.log('add child')
            p.addChild(x)
        } else if (lastNum.nestOp === false){
            console.log('add digit')
            if (lastNum.value === 1) {
                lastNum.value = '';
            }
            lastNum.value += x;
        } else if(lastNum.nested.length === 1){
            console.log('add digit to nest')
            if (lastNum.value === 1) {
                lastNum.value = '';
            }
            lastNum.value += x;            
        }
        console.log(lastNum)
        console.groupEnd()
    })

    //for siblings lastNum.sibling.length === 0
    EventBus.$on('btn-number', x => {
        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen - 1] : false;

        if (Store.parentheses || !lastNum || lastNum.nested.length !== 0) return
        if (!lastNum.holder || lastNum.nestOp) return
        console.group('sibling group')
        console.log('add digit to sibling')
        if (lastNum.getLast('sibling').value === 1) {
            lastNum.getLast('sibling').value = '';
        }
        lastNum.getLast('sibling').value += x;
        console.log(lastNum)
        console.groupEnd()
    })

    //for ['+', '-']
    EventBus.$on('btn-op', x => {
        if (!['+', '-'].includes(x) || !Store.parentheses) return

        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = p.nested[nestLen - 1];
        if(!lastNum.holder) return
        console.group('parentheses + or - group')
        if(lastNum.nested.length > 0){
            if (lastNum.getLast('nested').value === 1) {
                console.log('change nest child sign to: ' + x)
                lastNum.setLast('nested', 'sign', x);
            } else if (typeof lastNum.getLast('nested').value === 'string') {
                console.log('add extra nest child')
                lastNum.addChild([1, false, x])
            }
        }else if(lastNum.sibling.length > 0){
            if (lastNum.getLast('sibling').value === 1) {
                console.log('change sibling op to: ' + x)
                lastNum.setLast('sibling', 'op', x);
            } else if (typeof lastNum.getLast('sibling').value === 'string') {
                console.log('add extra sibling')
                lastNum.addSibling(1)
                lastNum.setLast('sibling', 'op', x)
            }
        }
        console.log(lastNum)
        console.groupEnd()
    })

    EventBus.$on('btn-op', x => {
        if (!['+', '-'].includes(x) || Store.parentheses) return
        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen-1] : false
        console.group('+ or - group')
        if (nestLen === 0) {
            console.log('first child sign')
            p.addChild(1).setLast('nested', 'sign', x);
            lastNum = p.nested[0]
        } else {
            if (lastNum.value === 1) {
                console.log('change child sign to: ' + x)
                lastNum.sign = x;
            } else if(typeof lastNum.value === 'string'){
                console.log('add child')
                p.addChild([1, false, x])
            } else if(lastNum.holder){
                if (lastNum.getLast('sibling').value === 1) {
                    //should maybe allow 'C' to undo * or / operator
                    console.log('removing sibling value 1')
                    lastNum.sibling.pop()
                } 
                //cant do nested without parentheses or /
                else if (lastNum.getLast('nested').value === 1){
                    console.log('removing nested value 1')
                    lastNum.nested.pop()
                    if(lastNum.nested.length < 1){
                        //move this to sanitizer or something, it comes up too often

                        // if(lastNum.sibling.length === 1){
                        //     console.log('deleting 1 element Holder, and moving child to parent')
                        //     lastNum = p.nested.pop();
                        //     p.addChild([lastNum.sibling[0].value, false, lastNum.op])
                        // }
                        lastNum.nestOp = false;
                    }
                }
                console.log('add child')
                p.addChild([1, false, x]);
            }
        }
        console.log(lastNum)
        console.groupEnd()
    })


    //for ['*', '/']
    EventBus.$on('btn-op', x => {
        let p = Store.aN;
        let nestLen = p.nested.length;
        let lastNum = nestLen > 0 ? p.nested[nestLen - 1] : false;
        if (!['*', '/'].includes(x) || !lastNum || Store.parentheses || lastNum.value === 1) return
        console.group('Op group')
        //later: just check parentheses, otherwise allow deep nesting?
        //retarded, you have to have one for nest and one for siblings
        //wrong:cant have nest without parentheses anymore, only sibling; lastNum can come after closing parentheses
        if (lastNum.nested.length === 0) {
            if (lastNum.holder){
                if(lastNum.getLast('sibling').value === 1){   
                    console.log('changing sibling operator')
                    if(x === '*'){
                        lastNum.getLast('sibling').op = x;
                    }else if(lastNum.sibling.length > 1){
                        console.log('creating nest')
                        lastNum.sibling.pop()
                        lastNum.nestOp = x;
                        lastNum.addChild(1)
                    }
                }else if(lastNum.getLast('sibling').op === '*'){
                    console.log('adding sibling')
                    lastNum.addSibling(1).getLast('sibling').op = x;
                }
            }else if(lastNum.value === 1){
                console.log('cant do anything with value 1')
            }else{
                console.log('turning lastNum to sibling')
                lastNum.addSibling(lastNum.value);
                if(x === '*'){
                    console.log('making extra sibling')
                    lastNum.addSibling(1).setLast('sibling', 'op', x);
                }else{
                    console.log('making nest')
                    lastNum.nestOp = x;
                    lastNum.addChild(1)
                }
            }
        }else if(lastNum.getLast('nested') && x === '*'){
            //here we cant do much
            //if i create nest, i can permit undoing first value 1 operator
            if(lastNum.nest.length === 1 && lastNum.nested[0].value === 1){
                console.log('undoing nest and making sibling')
                lastNum.nested.pop()
                lastNum.nestOp = false;
                lastNum.addSibling(1).setLast('sibling', 'op', x);
            }
        }
        console.log(lastNum)
        console.groupEnd()
    })    

}
