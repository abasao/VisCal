'use strict'

import { EventBus } from "./event-bus";
export default {
    state_exp: {},
    state_nr: {}
}
export function init(){
    EventBus.$on('test', x => {
        console.log('craaazy')
    })
}
