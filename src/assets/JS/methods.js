'use strict'
export default (() => {
    //start index, array => array of primes
    function prime(i,array){
        if(array.length <= i) return array
        return prime(i + 1, array.filter((x, index) => index === i || x % array[i] !== 0))
    }
    return {
        factorArray: prime(0, Array(1000).fill(1).map((x,i)=>x*(i+2))),
        // factorArray: [2, 3, 5, 7, 11, 13, 17],

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
            return [...this.primeFactor(parseInt(value, 10))];
        },

        rng(n, max = 10, min = 0) {
            let array = Array(n)
            for (let i = 0; i < n; i++) {
                array[i] = Math.floor(min + Math.random() * (max + 1))
            }
            return array
        },

        //(Array||Object, Coordinate) -> A[C1][C2][C3]...[Cn-1]
        finder(A, C){
            if (C.length === 1) {
                return A[C]
            }
            return this.finder(A[C[0]], C.slice(1))
        },

        sanitize(obj, parent, i = 0){
            if (obj.value === 1) {
                parent.removeChild(i)
            }
            else if (obj.nested.length > 0) {
                obj.nested.forEach((x, i) => {
                    this.sanitize(x, obj, i)
                })
            }
        }        
    }
})()