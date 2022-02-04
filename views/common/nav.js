'use strict';
// import {Router, App} from '../../src/core/coreBus.js'
import {Router, App} from '../../src/core/core.js'

export default {
    title: 'nav',
    navClass: 'gnb position-sticky bg-light us-none gnb-dark',
    navInnerClass: 'gnb-inner gnb-expand-md hide align-items-center',
    btnClass: 'btn btn-light text-gray fs-4',
    menulist: ()=>Object.keys(Router).filter(x=>!x.match(/home|404/gm)),
    genList(){
        return [...this.menulist()].map(li=>`
        <li>
            <a class="nav-link" href="${Router[li].path}">${Router[li].name.toUpperCase()}</a>
        </li>
        `).join('');
    },
    template: function() {
        return `
            <nav class="${this.navClass}">
                <div class="${this.navInnerClass}">
                    <div class="brand fw-bold">
                        <a href="#home">${App.brand}</a>
                    </div>
                    <div class="menu-btn">
                        <button class="${this.btnClass}" data-target="#gnbMenu" style="line-height: 1">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                    <ul id="gnbMenu" class="gnb-menu vgap-3 w-flex hide">
                        ${this.genList()}
                        <li class="search btn-bundle g-0">
                            <input type="text" class="form-input col">
                            <button class="btn btn-info">
                                <i class="fas fa-search"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        `
    }
}