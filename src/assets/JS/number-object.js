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

    addExpression(...exp){
        if(typeof exp !== 'object') return
        this.nested.push(...exp)
        this.setId(this.id)
    }

    addChild(...param) {
        if (!param) return
        param.forEach(x => {
            x = typeof x === 'object' ? x : [x]
            this.nested.push((new Num(...x)))
        })
        this.setId(this.id);
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
        console.log(typeof this.value)
        this.value = parseInt(this.value, 10);
        console.log(typeof this.value)
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

    setValue(value = false, f = false){
        this.value = typeof f === 'function' ? f(value || this.value) : value || this.value;
        this.factor = mod.factorize(this.value);
    }

    siblingOperator(f = false, i){
        if(!f && !i) return
        let n = this.nested;
        n[i - 1].setValue(f(parseInt(n[i - 1].value, 10), parseInt(n[i].value, 10)))
        n.splice(i,1);
        this.setId(this.id);
    }
    parentOperator(f = false){
        if(!f && this.nested && this.nested.length < 1 ) return
        this.nested.forEach(x => x.setValue(false, f.bind(null, this.value)))
        this.setValue(1);
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
    methods(that){
        return {
            add: this.siblingOperator.bind(that, (x,y) => x + y),
            sub: this.siblingOperator.bind(that, (x, y) => x - y),
        }
    }
}