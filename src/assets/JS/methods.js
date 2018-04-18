'use strict'
export default (() => {
    return {
        factorArray: [2, 3, 5, 7, 11, 13, 17],
        // idSeq: 1000 + Math.floor(Math.random() * 200),
        // counter: 0,
        isPrime(value) {
            return this.factorArray.includes(value, 1)
        },
        primeFactor(value) {
            if (this.factorArray.indexOf(value) !== -1) {
                return [value]
            } else {
                for (let f of this.factorArray) {
                    if (value % f === 0) {
                        return [f, ...this.primeFactor(value / f)]
                    }
                }
            }
            return [value]
        },
        factorize(value) {
            return [...this.primeFactor(value)];
        },
        rng(n, max = 10, min = 0) {
        let array = Array(n)
        for (let i = 0; i < n; i++) {
            array[i] = Math.floor(min + Math.random() * (max + 1))
        }
        return array
        },
        // createNest(obj, nested){
        //     obj.nested = nested.map((val, i) => {
        //         return { id: [...obj.id, ...['nested', i]], value: val, factor: this.factorize(val), nested: false }
        //     })
        //     return obj
        // },
        // createNumber(num, id){
        //      return {
        //         id: id, value: num, factor: this.factorize(num),
        //         nested: false
        //         }
        // },
        //(Array||Object, Coordinate) -> A[C1][C2][C3]...[Cn-1]
        finder(A, C){
            if (C.length === 1) {
                return A[C]
            }
            return this.finder(A[C[0]], C.slice(1))
        },
    }
})()