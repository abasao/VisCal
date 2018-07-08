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
        this.op = operator;
        this.factor = mod.factorize(val ? val : 1);
        this.nested = [];
        this.parentMethod;
    }

    getLast(){
        if(this.nested.length){
            return this.nested[this.nested.length -1]
        }
        return false
    }
    getNest(i=0){
        if(this.nested.length && this.nested.length > i){
            return this.nested[i]
        }
        return false
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
    setProperty(prop, val = 'unSet', unset = false){
        switch (prop) {
            case 'op':
                this.op = val !== 'unSet' ? val : this.op;
                break;
            case 'viewState':
                if (val !== 'unSet' && !this.viewState.includes(val) && !this.root) {
                    this.viewState.push(val)
                }
                break;
            case 'pow':
                this.pow = val !== 'unSet' ? [val] : this.pow;
                break;
        }
        return this
    }

    setLast(...val){
            if(this.nested.length){
                this.getLast().setProperty(...val)
            }
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

    setRemove(value = 'notSet'){
        this.remove = value !=='notSet' ? value : true;
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

        if (this.nested.length) {
            this.nested.forEach(child => {
                child.setParentMethod(this.addExpression.bind(this))
            })
        }
    }

    setValue(value = 'notSet', f = false){
        if(this.nested.length > 0){
            if(!arguments.length){
                this.nested.forEach(x=>x.setValue())
            }
        }else{
            if (typeof f === 'function'){
                this.value = f(value !== 'notSet' ? value : this.value)
            }else{
                this.value = value !== 'notSet' ? value : this.value
            }
            this.factor = mod.factorize(this.value ? this.value : 1)
        }

    }
    //accepts single array with all terms inside, like this.nested
    addExpression(exp = 'notSet', start = this.nested.length, replace = 0){
        if(exp === 'notSet') return
        if (typeof exp === 'object'){
            this.nested.splice(start, replace, ...exp)
        }else{
            this.nested.splice(start, replace)
        }
        this.setId(this.id)
        this.setParentMethod()
        this.setValue()
    }

    addChild(...param) {
        if (!param) return
        param.forEach(x => {
            x = [].concat(x)
            this.nested.push((new Num(...x)))
        })
        this.setId(this.id);
        this.setParentMethod();
        return this
    }

    clearRemoved(){
        if(this.nested.length){
            this.nested = this.nested.filter(x => x.remove !== true);
        }
        this.setId(this.id);
        return this
    }

    toInt(){

        if(this.nested.length){
            this.nested.forEach(child => {
                child.toInt()
            });
        }else{
            this.value = parseInt(this.value, 10);
        }
        return this
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
        if(!cur.getNest() && !prev.getNest()){
            if (!this.isDetached(cur.index()).every(x => x === true)) return
            console.log('normal addition')
            let newValue = cur.op === '+' ? cur.value : -1 * cur.value
            newValue += prev.op === '+' ? prev.value : -1 * prev.value
            prev.setValue(newValue)
            cur.remove = true
            if(prev.value < 0){
                prev.setValue(-1*prev.value)
                prev.op = '-'
            }else if(prev.value){
                prev.op = '+'
            }else{
                prev.remove = true
            }
            if(this.nested.length === 2 && !this.root && !prev.remove){
                prev.setProperty('op', this.op === prev.op ? '+' : '-')
                this.parentMethod([prev], this.index(), 1)
            }
        } else if (cur.getNest()){
            console.log('nested addition')
            cur.nested.forEach(x=>{
                if(['+', '-'].includes(x.op)){
                    x.setProperty('op', x.op !== cur.op ? '-' : '+')
                }
            })
            this.addExpression(cur.nested, cur.index(), 1)
        }
        this.clearRemoved()
    }

    mul(i){
        console.log('multiplier')
        let cur = this.nested[i]
        let prev = this.nested[i - 1]
        if (!cur.getNest() && !prev.getNest()){
            prev.setValue(prev.value*cur.value)
            cur.setRemove()
        }else{
            if(cur.getNest() && !prev.getNest()){
                console.log('current nested, prev not nested')
                mod.multiplier(prev.value, cur)
                cur.setProperty('op', prev.op)
                prev.setRemove()
            } else if (!cur.getNest() && prev.getNest()){
                mod.multiplier(cur.value, prev)
                cur.setRemove() 
            }else{
                console.log('not dual nest')
            }
        }
        this.clearRemoved()
    }

    doOperation(f = false, i){
        if(!f && !i) return
        let n = this.nested;
        if (n[i - 1].nested.length > 0 || n[i].nested.length > 0) return
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
    expand(){
        this.parentMethod([mod.expand(this)], this.id[this.id.length-1], 1)
    }
    Commander(i=0, inpt = 'default'){
        if(inpt === 'default'){
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
        }else if(inpt === 'expand'){
            
        }else if(inpt === 'compress'){

        }
    }

    methods(){
        return {
            add: this.doOperation.bind(this, (x, y) => x + y),
            com: this.Commander.bind(this),
            // expand: mod.expand(this)
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