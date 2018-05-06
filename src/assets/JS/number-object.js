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
        this.op = false; //for parent-child 4*(1+3+4)
        this.nestOp = operator; //for siblings 4*4*4/3
        this.factor = mod.factorize(val);
        //this.group = false; //check is any of the siblings have op = true
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
            default:
                break;
        }
        return this
    }

    setViewState(state = false){
        if(this.root || !state) return
        //Do this in component state as computed prop
        // if (!this.viewState[0]){
        //     this.viewState.push('nested-'+Math.floor(this.id.length / 2))
        // } else if (this.viewState[0].match(/nested-[0-9]/) !== null){
        //     this.viewState[0] = 'nested-' + Math.floor(this.id.length/2)
        // }
        if(!this.viewState.includes(state)){
            this.viewState.push(state)
        }
    }
    setRoot(id) {
        this.root = true;
        this.value = false;
        this.factor = false;
        this.remove = false;
        this.op = false;
        this.nestOp = false;
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

        if(this.sibling.length === 0){
            this.sibling.push(new Num(this.value))
            this.sign = this.value < 0 ? '-' : '+';
            this.value = false;
        }

        param.forEach(x => {
            x = typeof x === 'object' ? x : [x]
            this.sibling.push((new Num(...x)))
        })

        if(this.nestOp || this.op){
            this.sibling[1].setProperty('op', this.nestOp || this.op || '*')
            this.nestOp = this.op = false;
        }

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
        this.value = parseInt(this.value, 10);
        if(this.nested.length > 0 ){
            this.nested.forEach(element => {
                element.toInt()
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
        if (this.sibling.length > 0) {
            this.sibling.forEach((element) => {
                element.setParentMethod(this.addExpression.bind(this))
            })
        }
    }

    setValue(value = false, f = false){
        this.value = typeof f === 'function' ? f(value || this.value) : value || this.value;
        this.factor = mod.factorize(this.value);

        if(arguments.length === 0 && this.nested.length > 0){
            this.nested.forEach(x=>x.setValue())
        }
        if (arguments.length === 0 && this.sibling.length > 0) {
            this.sibling.forEach(x => x.setValue())
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