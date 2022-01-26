'use strict';
import Router from '../core/core.js'
import nav from './nav.js'
import footer from './footer.js'

Router.nav = new Router('nav', '', nav);
Router.footer = new Router('footer', '', footer);

Object.defineProperty(Object.prototype, 'convert', {
    value: function (){
        let root = this;
        this.convertedView = this.convertedView.replace(/\{\{([\s\S]+?)\}\}/gm, function (a,b) {
            if(b=='page') b = root.getPage;
            if(Router[b]) {
                return Router[b].page.template();
            }
            else return a;
        });
        return this;
    }
})

export default {
    module: {
        nav,
        footer
    },
    convertedView: null,
    setPage: function(page){
        Router[page.name] = page;
        this.getPage = page.name;
        return this;
    },
    getPage: null,
    template: function (page='home') {
        this.convertedView = `
            {{nav}}
            {{page}}
            {{footer}}
        `
        return this;
    },
    render(){
        return this.convertedView;
    }
}