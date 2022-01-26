'use strict';
import Router from '../core/core.js'

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
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis accusamus nulla incidunt suscipit ipsam quis, vel in alias rerum, expedita reprehenderit est iusto sint, unde voluptatibus atque dolorum quam possimus?
                    </p>
                </div>
            </main>
        </div>
        `
    }
}