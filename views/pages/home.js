'use strict';

import {Router} from '../../src/core/core.js'
import HomeSub from './home.sub.js'

HomeSub.parent = '#home';
Router.homesub = new Router('homesub', '', HomeSub);

export default {
    title: 'home',
    module: {
        homesub: Router['homesub']
    },
    template: function() {
        return `
        <div class="main">
            <main>
                <div class="fence-full">
                    <div>
                        <span class="h1">${this.title}</span>
                    </div>
                    <p>
                        <a href="#home">home</a>
                        <a href="#about">about</a>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis accusamus nulla incidunt suscipit ipsam quis, vel in alias rerum, expedita reprehenderit est iusto sint, unde voluptatibus atque dolorum quam possimus?
                    </p>
                </div>
            </main>
        </div>
        `
    }
}