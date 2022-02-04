'use strict';

// import {Router, App} from '../../src/core/coreBus.js'
import {Router, App} from '../../src/core/core.js'
import HomeSub from './home.sub.js'

Router.setSubPage('homesub-test', 'home.sub', HomeSub);

export default {
    title: 'home',
    template: function() {
        return `
        <div class="main">
            <main>
                <div class="fence-full">
                    <div>
                        <span class="h1">${this.title}</span>
                    </div>
                    <p>
                        <a href="${this.module.$home_sub.path}">${this.module.$home_sub.convertedName}</a>
                        <a href="#about">about</a>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis accusamus nulla incidunt suscipit ipsam quis, vel in alias rerum, expedita reprehenderit est iusto sint, unde voluptatibus atque dolorum quam possimus?
                    </p>
                </div>
            </main>
        </div>
        `
    }
}