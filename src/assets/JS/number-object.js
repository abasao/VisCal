'use strict'
import mod from ".//methods";
export class Num {
    constructor(val = 1, id = false, sign = '+', operator = false) {
        this.root = false;
        this.remove = false;
        this.id = id || [];
        this.viewState = [];
        this.value = val;
        this.pow = [1];
        this.op = operator; //for sibling interaction sibling[a] op sibling[b]
        this.factor = mod.factorize(val ? val : 1);
        this.nested = [];
        this.parentMethod;
    }

    setProperty(prop, val = false, unset = false){
        switch (prop) {
            case 'op':
                if(!unset){
                    this.op = val || this.op;
                }else {
                    console.log('op is: ' + this.op)
                    this.op = !this.op ? this.nestOp || val : this.op;
                    console.log('nestop is: ' + this.nestOp)
                    this.nestOp = this.nestOp ? false : this.nestOp;
                }
                break;
            case 'viewState':
                if (!this.viewState.includes(val) && !this.root) {
                    this.viewState.push(val)
                }
                break;
            case 'pow':
                this.pow = [val] || this.pow;
                break;
            default:
                break;
        }
        return this
    }

    setLast(target = false, ...val){
            if(target && this.nested.length > 0){
                this.nested[this.nested.length-1].setProperty(...val)
            }
    }
    getLast(target = false){
        if(target && this.nested.length > 0){
            return this.nested[this.nested.length -1]
        }
        return false
    }
    getNest(i=0){
        if(this.nested.length > 0 && i < this.nested.length){
            return this.nested[i]
        }
        return false
    }
    setViewState(state = false){
        if(this.root || !state) return
        //Do this in component state as computed prop
        // if (!this.viewState[0]){
        //     this.viewState.push('nested-'+Math.floor(this.id.length / 2))
        // } else if (this.viewState[0].match(/nested-[0-9]/) !== null){
        //     this.viewState[0] = 'nested-' + Math.floor(this.id.length/2)
        // }
        // if(!this.viewState.includes(state)){
        //     this.viewState.push(state)
        // }
    }

    setRoot(id) {
        this.root = true;
        this.value = false;
        this.factor = false;
        this.remove = false;
        this.op = false;
        this.id.push(id || 0);
        return this
    }

    //accepts single array with all terms inside, like this.nested
    addExpression(exp, start = false, replace = 0){
        if(typeof exp !== 'object') return
        this.nested.splice(start || this.nested.length, replace, ...exp)
        this.setId(this.id)
        this.setParentMethod()
        this.setValue()
    }

    addChild(...param) {
        if (!param) return
        param.forEach(x => {
            x = typeof x === 'object' ? x : [x]
            this.nested.push((new Num(...x)))
        })
        this.setId(this.id);
        this.setParentMethod();
        return this
    }

    clearRemoved(){
        if(this.nested.length > 0){
            this.nested = this.nested.filter(x => x.remove !== true);
        }
        this.setId(this.id);
        return this
    }

    setRemove(value = 'notSet'){
        this.remove = value !=='notSet' ? value : this.remove;
    }

    toInt(){

        if(this.nested.length > 0 ){
            this.nested.forEach(child => {
                child.toInt()
            });
        }else{
            this.value = parseInt(this.value, 10);
        }
        return this
    }

    setId(id) {
        if (!id) return
        this.id = typeof id === 'object' ? id : [id];
        if (this.nested.length > 0) {
            this.nested.forEach((child, i) => {
                child.setId([...id, 'nested', i])
            })
        }
    }

    setParentMethod(parent = false){
        if(typeof parent === 'function'){
            this.parentMethod = parent;
        }

        if (this.nested.length > 0) {
            this.nested.forEach(child => {
                child.setParentMethod(this.addExpression.bind(this))
            })
        }
    }

    setValue(value = false, f = false){
        if(this.nested.length > 0){
            if(arguments.length === 0 && this.nested.length > 0){
                this.nested.forEach(x=>x.setValue())
            }
        }else{
            this.value = typeof f === 'function' ? f(value || this.value) : value || this.value;
            this.factor = mod.factorize(this.value ? this.value : 1);
        }

    }
    isDetached(i = 0){
        let det = []
        if(i + 1 >= this.nested.length){
            det.push(true)
        } else{
            det.push(['+', '-'].includes(this.nested[i + 1].op) ? true : false)
        }
        if(i - 1 <= this.nested.length){
            det.push(true)
        }else{
            det.push(['+', '-'].includes(this.nested[i + 1].op) ? true : false)
        }
        return det
    }
    index(){
        return this.id.slice(-1)[0]
    }
    add(i){
        let cur = this.nested[i]
        let prev = this.nested[i-1]
        if(!cur.getNest() && !prev.getLast()){
            console.log('normal addition')
            if(cur.op === '+'){
                if(prev.op === '+'){
                    prev.setValue(cur.value + prev.value)
                }else{
                    prev.setValue(cur.value - prev.value)
                }
            }else{
                if (prev.op === '+') {
                    prev.setValue(prev.value - cur.value)
                } else {
                    prev.setValue(- cur.value - prev.value)
                }
            }
            cur.remove = true
            if(prev.value < 0){
                prev.setValue(-1*prev.value)
                prev.op = '-'
            }else if(prev.value > 0){
                prev.op = '+'
            }else{
                prev.remove = true
            }
        }else{
            console.log('nested addition')
        }
        this.clearRemoved()
    }
    mul(i){
        console.log('multiplier')
        let first = this.nested[i]
    }
    doOperation(f = false, i){
        if(!f && !i) return
        let n = this.nested;
        if (n[i - 1].nested.length > 0 || n[i].nested.length>0) return
        n[i - 1].setValue(f(parseInt(n[i - 1].value, 10), parseInt(n[i].value, 10)))
        n.splice(i,1);
        this.setId(this.id);
    }
    //this is not needed, nothing operates on nest anymore
    doNestedOperation(f = false){
        if(!f && this.nested && this.nested.length < 1 ) return
        this.nested.forEach(x => x.setValue(false, f.bind(null, this.value)))
        this.parentMethod(this.nested, this.id.pop(), 1)
    }

    Commander(i=0){
        if (this.nested.length < 2) return
        switch (this.nested[i].op) {
            case '+':
            case '-':
                this.add(i)
                break;
            case '*':
                this.mul(i)
                break;
            default:
                break;
        }        
        // switch (command) {
        //     case 'multiply':
        //         this.doNestedOperation((factor, x) => x * factor)
        //         break;
        //     case 'divide':
        //         this.doNestedOperation((factor, x) => x / factor)
        //         break;
        //     case 'power':
        //         this.doNestedOperation((factor, x) => {
        //             return Array(Math.abs(factor)).fill(x).reduce((acc, val) => {
        //                 return factor > 0 ? acc * val : acc / val
        //             }, 1)
        //         })
        //         break;
        //     default:
        //         break;
        // }
    }

    methods(){
        return {
            add: this.doOperation.bind(this, (x, y) => x + y),
            com: this.Commander.bind(this)
        }
    }
}

export class NumObj { 
    constructor (val = 'notSet', op = false, par = false){
        this.value = val === 'notSet' ? false : val*1,
        this.op = op,
        this.parentheses = par;
        this.nested = []
    }
    addValue(v = 'notSet'){
        console.group('addValue group')
        if(v === 'notSet') return
        if(v === false){
            this.value = false
        }else if(this.value === 'notSet' || this.value === false){
            console.log('notSet or false')
            this.value = v*1
        }else{
            console.log('real value')
            this.value = this.value + '' + v
            this.value *= 1
        }
        console.groupEnd()
        return this
    }
    getLast(){
        if(this.nested.length > 0){
            return this.nested.slice(-1)[0]
        }
        return false
    }
    changeSign(s = false){
        if(!s) return
        switch (s) {
            case '+':
                this.value *= this.value < 0 ? -1 : 1
                break;
            case '-':
                this.value *= this.value < 0 ? 1 : -1
                break;
            default:
                break;
        }
    }

    changeOp(o = 'notSet'){
        if (o === 'notSet') return
        switch (o) {
            case '*':
                this.op = o;
                break;
            case '/':
                this.op = o;
                break;
            case '-':
                this.op = o;
                break;
            case '+':
                this.op = o;
                break;
            default:
                break;
        }
        return this
    }
}