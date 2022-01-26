'use strict';

/**
 * app을 정한다.
 * 
 * router객체에 패스를 정한다.
 * 
 * router객체에 데이터를 준다.
 * 
 * 렌더한다.
 */

import Router from './core/core.js'
import router from './routes/router.js'
import layout from './common/layout.js'

(function (){
    function Controller(){
        let models = null;
        this.init = function (model){
            models = model;

            window.addEventListener('click', this.handleAnchors);
            window.addEventListener('mouseup', this.handleSideClick);
        }

        this.handleAnchors = function (ev){
            const target = ev.target;
            if(target.tagName !== 'A') return ;

            ev.preventDefault();
            
            models.handleAnchors(target);
        }

        this.handleSideClick = function (ev){
            const target = ev.target;
            if(target.tagName == 'A') return ;
            if(ev.which !== 4 && ev.which !== 5) return;
            ev.preventDefault();

            models.handleSideClick(ev, target);
        }
    }
    function Model(){
        let current = null;
        let virtualHistory = [];
        let virtualAfter = [];
        let views = null;

        this.init = function (view){
            views = view;

            if(location.hash){
                current = location.hash;
            } else {
                current = '#home';
            }
            this.setHistory(current);
        }

        this.handleAnchors = function (anchor){
            let href = anchor.getAttribute('href');

            if(href.match(/http|https|mailto|tel/gm)) {
                // hash 외 location 변경
                location = href;
                return;
            }
            
            if(href.match(/^\#/gm)){
                current = href;

                if(!this.compareLastHistory(href)){
                    this.setHistory(href);
                }
                console.log(virtualHistory)
            }
        }

        this.handleSideClick = function (ev, target){
            if(ev.which == 4){
                if(virtualHistory.length>1){
                    // before
                    virtualAfter.unshift(virtualHistory.pop());
                    let before = virtualHistory.slice(-1).pop();
                    current = before;
                }
            } else if(ev.which == 5) {
                if(virtualAfter.length>1){
                    // after
                    let after = virtualAfter.shift();
                    virtualHistory.push(after);
                    current = after;
                }
            }
            this.replaceHistory(current);
            this.renderView(current);
        }

        this.setHistory = function (href){
            this.fakeLocation(href);
            virtualHistory.push(href);
            this.renderView(current);
        }

        this.replaceHistory = function (href){
            history.replaceState({}, '', href);
        }

        this.fakeLocation = function (href){
            history.pushState({}, '', href);
        }

        this.compareLastHistory = function (href){
            return virtualHistory.slice(-1).pop() == href;
        }

        this.renderView = function (href){
            const name = href.slice(1);
            views.renderView(name);
        }
    }
    function View(){
        let parts = null;
        let app = null;
        this.init = function (part){
            parts = part;
            app = document.querySelector(parts.options.el);
        }

        this.clearView = function (){
            app.innerHTML = '';
        }

        this.renderView = function(name){
            this.clearView();
            app.insertAdjacentHTML('beforeend', 
                parts
                    .layout
                    .template()
                    .setPage(router[name])
                    .convert()
                    .render());
        }
    }
    return {
        init(options){
            const parts = {
                router,
                layout,
                options,
            }
            
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(parts);
            model.init(view);
            controller.init(model);
        }
    }
})().init({
    el: '#app',
})