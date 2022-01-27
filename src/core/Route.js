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

export default (function (){
    function Controller(){
        let models = null;
        this.init = function (model){
            models = model;

            window.addEventListener('click', this.handleAnchors);
            window.addEventListener('popstate', this.handleState);
        }

        this.handleAnchors = function (ev){
            const target = ev.target;
            let href = target.getAttribute('href');

            if(target.tagName !== 'A') return ;
            if(href.match(/http|https|mailto|tel/gm)) return;

            ev.preventDefault();
            
            models.handleAnchors(target);
        }

        this.handleState = function (ev){
            models.handleState(ev);
        }
    }
    function Model(){
        let current = null;
        let views = null;

        this.init = function (view){
            views = view;
            this.setHistory(location.hash||'#home');
        }

        this.handleAnchors = function (anchor){
            let href = anchor.getAttribute('href');
            if(href == current) return;
            this.setHistory(href);
        }

        this.handleState = function (ev){
            let before = current;
            if(ev.state!=null){
                current = (ev.state.page??'#home');
            } else {
                current = location.hash;
            }
            if(current == '') current = '#home';
            if(before == location.hash) return;
            this.renderView(current);
        }

        this.setHistory = function (href){
            current = href.removeSign();
            this.fakeLocation(current);
            this.renderView(current);
        }

        this.fakeLocation = function (href){
            history.pushState({page: href}, '', href);
        }

        this.renderView = function (href){
            const name = href.slice(1).removeSign();
            views.renderView(name);
        }
    }
    function View(){
        let parts = null;
        let app = null;
        this.init = function (part){
            parts = part;
            app = document.querySelector(parts.el);
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
                    .setPage(parts.router[name])
                    .convert()
                    .render());
        }
    }
    return {
        init(options){
            const parts = {
                ...options,
            }
            
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(parts);
            model.init(view);
            controller.init(model);
        }
    }
})();