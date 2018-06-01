'use strict'
import mod from ".//methods";
export class Num {
    constructor(val = 1, id = false, sign = '+', operator = false) {
        this.root = false;
        this.remove = false;
        this.id = id || [];
        this.viewState = [];
        this.value = val;
        this.sign = sign;
        this.pow = [1];
        this.op = operator; //for sibling interaction sibling[a] op sibling[b]
        this.nestOp = false; //for (sibling) nestOp (nest), deleting this
        this.holder = false; //number is converted to holding object that holds nest and/or sibling
        this.factor = mod.factorize(val ? val : 1);
        this.sibling = [];
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
            case 'nestOp':
                if (!unset) {
                    this.nestOp = val || this.nestOp;
                } else {
                    //if it's false, set it equal to sibling op or given value
                    //users will likely press operator before parentheses, not knowing
                    //operator is automatically added
                    this.nestOp = !this.nestOp ? this.op || val : this.nestOp;
                    this.op = this.op ? false: this.op;
                }            
                break;
            case 'sign':
                if (!unset) {
                    this.sign = val || this.sign;
                } else {
                    this.sign = !this.sign ? val : this.sign;
                }             
                this.sign = val || this.sign;
                break;
            case 'viewState':
                if (!this.viewState.includes(val) && !this.root) {
                    this.viewState.push(val)
                }
                break;
            case 'pow':
                this.pow = [val] || this.pow;
                break;
            case 'holder':
                this.holder = val || this.holder;
                break;
            default:
                break;
        }
        return this
    }

    setLast(target = false, ...val){
        switch (target) {
            case 'nested':
                if(this.nested.length > 0){
                    this.nested[this.nested.length-1].setProperty(...val)
                }
                break;
            case 'sibling':
                if (this.sibling.length > 0) {
                    this.sibling[this.sibling.length - 1].setProperty(...val)
                }
                break;
        
            default:
                break;
        }
    }
    getLast(target = false){
        let targetEl = false;
        switch (target) {
            case 'nested':
                if(this.nested.length > 0){
                    targetEl = this.nested[this.nested.length -1]
                }
                break;
            case 'sibling':
                if(this.sibling.length > 0){
                    targetEl = this.sibling[this.sibling.length -1]
                }
                break;
        
            default:
                break;
        }
        return targetEl
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
        this.holder = true;
        this.nestOp = false;
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

    //only for use when adding expression
    evaluateSign() {
        this.value = this.sign === '+' ? this.value : -1 * this.value
        if (this.nested.length > 0) {
            this.nested.forEach(element => {
                element.evaluateSign()
            });
        }
        if (this.sibling.length > 0) {
            this.sibling.forEach(element => {
                element.evaluateSign()
            });
        }
        return this
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

    addSibling(...param) {
        if (!param || this.nested.length > 0) return
        //moving first number object to sibling level, then adding sibling in param
        if(this.sibling.length === 0){
            this.value = false;
            this.holder = true;
            this.op = this.sign;
            this.nestOp = false;
        }

        param.forEach(x => {
            x = typeof x === 'object' ? x : [x]
            this.sibling.push((new Num(...x)))
        })

        // if(this.nestOp || this.op){
        //     this.sibling[1].setProperty('op', this.nestOp || this.op || '*')
        //     this.nestOp = this.op = false;
        // }

        this.setId(this.id);
        this.setParentMethod();
        return this
    }
    createHolder(){
        if (this.nested.length > 0) return
        this.addChild([this.value])
        this.value = false;
        this.holder = true;
        this.setId(this.id);
        this.setParentMethod();
        return this        
        // this.op = this.sign;
        // this.nestOp = false;
    }
    addNested(...param) {
        if (!param || this.nested.length > 0) return
        //moving first number object to sibling level, then adding sibling in param
        if(this.nested.length === 0){
            this.value = false;
            this.holder = true;
            this.op = this.sign;
            this.nestOp = false; //has to go away
        }

        param.forEach(x => {
            x = typeof x === 'object' ? x : [x]
            this.nested.push((new Num(...x)))
        })

        // if(this.nestOp || this.op){
        //     this.sibling[1].setProperty('op', this.nestOp || this.op || '*')
        //     this.nestOp = this.op = false;
        // }

        this.setId(this.id);
        this.setParentMethod();
        return this
    }

    clearRemoved(){
        if(this.nested.length > 0){
            this.nested = this.nested.filter(x => x.remove !== true);
        }
        if(this.sibling.length > 0){
            this.sibling = this.sibling.filter(x => x.remove !== true);
        }
        this.setId(this.id);
        return this
    }

    setRemove(value){
        this.remove = value || this.remove;
    }

    toInt(){
        if(this.holder){
            if(this.nested.length > 0 ){
                this.nested.forEach(child => {
                    child.toInt()
                });
            }
            this.sibling.forEach(sib => {
                sib.toInt()
            });
        }else{
            this.value = parseInt(this.value, 10);
        }
        return this
    }

    setId(id) {
        if (!id) return
        this.id = typeof id === 'object' ? id : [id];
        if(this.holder){
            if (this.nested.length > 0) {
                this.nested.forEach((child, i) => {
                    child.setId([...id, 'nested', i])
                })
            }
            this.sibling.forEach((sib, i) => {
                sib.setId([...id, 'sibling', i])
            })
        }
    }

    setParentMethod(parent = false){
        if(typeof parent === 'function'){
            this.parentMethod = parent;
        }
        if(this.holder){
            if (this.nested.length > 0) {
                this.nested.forEach(child => {
                    child.setParentMethod(this.addExpression.bind(this))
                })
            }
            this.sibling.forEach(sib => {
                sib.setParentMethod(this.addExpression.bind(this))
            })

        }
    }

    setValue(value = false, f = false){
        if(this.holder){
            if(arguments.length === 0 && this.nested.length > 0){
                this.nested.forEach(x=>x.setValue())
            }
            this.sibling.forEach(x => x.setValue())
        }else{
            this.value = typeof f === 'function' ? f(value || this.value) : value || this.value;
            this.factor = mod.factorize(this.value ? this.value : 1);
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
    makeParentheses(){

    }
    undoParentheses(){
        
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