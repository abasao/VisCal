'use strict'
import mod from ".//methods";
export class Num {
    constructor(val = 1, id = false, sign = '+', operator = '*') {
        this.root = false;
        this.remove = false;
        this.id = id || [];
        this.value = val;
        this.sign = sign;
        this.op = operator;
        this.factor = mod.factorize(val);
        this.nested = [];
        this.parentMethod;
    }

    setRoot(id) {
        this.root = true;
        this.value = false;
        this.factor = false;
        this.remove = false;
        this.op = false;
        this.id.push(id||0);
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
        if(this.nested.length < 1) this
        this.nested = this.nested.filter(x => x.remove !== true);
        this.setId(this.id);
        return this
    }

    setRemove(value){
        this.remove = value || this.remove;
    }

    toInt(){
        this.value = parseInt(this.value, 10);
        if(this.nested.length > 0 ){
            this.nested.forEach(element => {
                element.toInt()
            });
        }
        return this
    }
    //only for use by addExpression
    evaluateSign(){
        this.value = this.sign === '+' ? this.value : -1*this.value
        if(this.nested.length > 0){
            this.nested.forEach(element => {
                element.evaluateSign()
            });
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
            this.nested.forEach((child) => {
                child.setParentMethod(this.addExpression.bind(this))
            })
        }        
    }

    setValue(value = false, f = false){
        this.value = typeof f === 'function' ? f(value || this.value) : value || this.value;
        this.factor = mod.factorize(this.value);
        if(arguments.length === 0 && this.nested.length > 0){
            this.nested.forEach(x=>x.setValue())
        }
    }

    siblingOperator(f = false, i){
        if(!f && !i) return
        let n = this.nested;
        if (n[i - 1].nested.length > 0 || n[i].nested.length>0) return
        n[i - 1].setValue(f(parseInt(n[i - 1].value, 10), parseInt(n[i].value, 10)))
        n.splice(i,1);
        this.setId(this.id);
    }
    parentOperator(f = false){
        if(!f && this.nested && this.nested.length < 1 ) return
        this.nested.forEach(x => x.setValue(false, f.bind(null, this.value)))
        this.parentMethod(this.nested, this.id.pop(), 1)
    }
    Commander(command){
        switch (command) {
            case 'multiply':
                this.parentOperator((factor, x) => x * factor)
                break;
            case 'divide':
                this.parentOperator((factor, x) => x / factor)
                break;
            case 'power':
                this.parentOperator((factor, x) => {
                    return Array(Math.abs(factor)).fill(x).reduce((acc, val) => {
                        return factor > 0 ? acc * val : acc / val
                    }, 1)
                })
                break;
            default:
                break;
        }
    }
    methods(){
        return {
            add: this.siblingOperator.bind(this, (x,y) => x + y),
            sub: this.siblingOperator.bind(this, (x, y) => x - y),
        }
    }
}