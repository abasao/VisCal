/* eslint-disable no-new */
import Vue from 'vue';
import List from '@/components/List';

describe('todo list in vue', () => {
    it('should render correct contents', () => {
        const Constructor = Vue.extend(List)
        const vm = new Constructor().$mount()
        expect(vm.$el.querySelector('.my-list h1').textContent)
            .to.equal('My To Do List')
    })
    it('adds a new item to list on click', () => {
        // our test goes here
        const Constructor = Vue.extend(List)
        const vm = new Constructor().$mount()
        vm.todoItem = 'brush my teeth';
        const button = vm.$el.querySelector('button');
        // simulate click event
        const clickEvent = new window.Event('click');
        button.dispatchEvent(clickEvent);
        vm._watcher.run();
        expect(vm.$el.textContent).to.contain('brush my teeth');
        expect(vm.todoItem).to.equal('');            
    })
})
