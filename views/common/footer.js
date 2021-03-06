'use strict';
// import {Router, App} from '../../src/core/coreBus.js'
import {Router, App} from '../../src/core/core.js'

export default {
    title: 'footer',
    menulist: ()=>Object.keys(Router).filter(x=>!x.match(/home|404/gm)),
    genList(){
        return [...this.menulist()].map(li=>`
        <div><a href="#${li}" class="nav-link">${li.toUpperCase()}</a></div>
        `).join('');
    },
    footerClass: 'footer bg-light p-3 w-flex fustify-content-start',
    template: function() {
        return `
        <footer class="${this.footerClass}">
            <span class="brand text-white fw-bold">
                <a href="#home">${App.brand}</a>
            </span>
            <div class="w-flex justify-content-start ps-3 gx-3">
                ${this.genList()}
            </div>
        </footer>
        `
    }
}