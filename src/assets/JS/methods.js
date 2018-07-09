'use strict'
import { Num } from "./number-object";
export default (() => {
    //start index, array => array of primes
    function prime(i,array){
        if(array.length <= i) return array
        return prime(i + 1, array.filter((x, index) => index === i || x % array[i] !== 0))
    }
    let factorArray = prime(0, Array(1000).fill(1).map((x, i) => x * (i + 2)))
    function primeFactor(value) {
        if (factorArray.indexOf(value) !== -1) {
            return [value]
        } else {
            for (let f of factorArray) {
                if (value % f === 0) {
                    return [f, ...primeFactor(value / f)]
                }
            }
        }
        return [value]
    }

    function factorize(value) {
        return [...primeFactor(parseInt(value, 10))];
    }

    function rng(n, max = 10, min = 0) {
        let array = Array(n)
        for (let i = 0; i < n; i++) {
            array[i] = Math.floor(min + Math.random() * (max + 1))
        }
        return array
    }

    //(Array||Object, Coordinate) -> A[C1][C2][C3]...[Cn-1]
    function finder(A, C){
        if (C.length === 1) {
            return A[C]
        }
        return finder(A[C[0]], C.slice(1))
    }

    function sanitize(obj, parent, i = 0){
        if (obj.value === 1) {
            parent.removeChild(i)
        }
        else if (obj.nested.length > 0) {
            obj.nested.forEach((x, i) => {
                sanitize(x, obj, i)
            })
        }
    }

    function compressable(num){
        return {
            sameValueOp: num.nested.every(x => x.value === num.nested[0].value && x.op === num.nested[0].op),
            plusMinus: num.nested.every(x => ['+', '-'].includes(x.op))
        }
    }

    function multiplier(factor = false, source = false){
        if(!factor || !source) return
        let m = []
        source.nested.forEach((x, i) => {
            ['+', '-'].includes(x.op) ? m.push(i) : false
        })
        m.shift()
        m.push(source.nested.length)
        m.reverse()
        m.forEach(x => {
            source.addExpression([new Num(factor, false, '+', '*')], x, 0)
        })
    }
    function divide(n){
        if ((n % 3) && !(n % 4)){
            return Array(4).fill(n / 4)
        } else if((n % 3) && !(n % 5)) {
            return Array(5).fill(n/5)
        }
        let newArray = Array(3).fill(Math.floor(n / 3))
        return factorize(n).includes(3) ? newArray : newArray.concat(n - 3*newArray[0])
    }

    function expand(num = false){
        if(!num || num.value < 3) return num
        return (new Num(false,false, '+', num.op))
                .addChild(...divide(num.value).map(n => [n, false, '+', '+']))
    }
    function compress(num = false){
        if (!num || num.nested.length < 2) return num
        if (compressable(num).sameValueOp){
            let newNum = new Num(false, false, '+', num.op)
            if (num.nested[0].value === 1) return newNum.addChild([num.nested.length, false, '+', num.nested[0].op])
            return newNum
                .addChild([num.nested.length, false, '+', num.nested[0].op], [num.nested[0].value, false, '+', '*'])
        } else if (compressable(num).plusMinus){
            let nFactor = factorize(num.nested.reduce((acc, val)=> acc + val.value, 0))

            return (new Num(false, false, '+', num.op))
                .addChild([nFactor.pop(), false, '+', '+'], [nFactor.reduce((acc, val) => acc * val, 1), false, '+', '*'])
        } else return num
    }
    return {
        factorArray,
        primeFactor,
        factorize,
        rng,
        finder,
        multiplier,
        sanitize,
        expand,
        compress
    }
})()