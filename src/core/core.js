/**!
 * router v0.2.1 (https://github.com/kkn1125/router)
 * Copyright 2021 Authors (https://github.com/kkn1125/router/graphs/contributors) kkn1125
 * Licensed under MIT (https://github.com/kkn1125/router/blob/main/LICENSE)
 */

'use strict';
const App = {
    name: 'Router.js',
    brand: 'Router',
    version: '0.2.1',
    author: 'kimson',
}

const base404 = {
    title: '404',
    template: function() {
        return `
        <div class="main">
            <main>
                <div class="py-5"></div>
                <div class="fence-full text-center">
                    <div>
                        <span class="display-1 text-danger">${this.title}</span>
                    </div>
                    <p class="fs-1 fw-bold">
                    </p>
                    <span class="notice notice-danger w-inline-block">
                        <span class="fw-bold">[Not Found]</span>
                        해당 페이지를 찾을 수 없습니다. 😅
                    </span>
                    <p class="mt-3">
                        <button
                        onclick="location='#home'"
                        class="btn btn-frame-primary px-2">Home</button>
                    </p>
                </div>
            </main>
        </div>
        `
    }
}

const watch = (function(){
    fetch('https://cdn.jsdelivr.net/gh/kkn1125/router@vlatest/src/core/core.js')
    .then(function (res){
        return res.text();
    })
    .then(function (data){
        let version = data.match(/version\s*\:\s*\'([\s\S]+?)\'/im)[1];
        let strUse = App.version.replace(/[^0-9]+/gm, '');
        let strRepo = version.replace(/[^0-9]+/gm, '');
        let useVer = parseInt(strUse);
        let repoVer = parseInt(strRepo);
        try{
            if(useVer >= repoVer){
                throw new Error(`[Router Note] 현재 최신버전입니다. %cver ${App.version}`);
            } else {
                throw new Error(`[Router Note] 최신 버전이 새로 나왔습니다. 업데이트가 필요합니다. https://github.com/kkn1125/router\n%ccurrent Ver ${App.version} >> new ver ${version}`)
            }
        } catch(e){
            console.log(`%c${e.message}`, 'color: #90ffbc', 'color: #4aff92');
        }
    })
})();

if(!Object.prototype.hasOwnProperty('convert'))
Object.defineProperty(Object.prototype, 'convert', {
    value: function (){
        let root = this;
        this.originView.split('\n').map(x=>{
            this.convertedView.push(x.replace(/\{\{([\s\S]+?)\}\}/gm, function (a,b) {
                if(b=='page') b = root.getPage;
                if(Router[b]) {
                    root[b] = Router[b].page.template().trim();
                    return root[b]; // v0.2.1 버그 수정 (중복)
                } else {
                    root[a] = a;
                    return a;
                }
            }).trim());
        })
        return this;
    },
    enumerable: true,
    configurable: true
});

if(!Object.prototype.hasOwnProperty('removeSign'))
Object.defineProperty(Object.prototype, 'removeSign', {
    value: function (){
        return this.replace(/[\.\-\_]+/gm,' ');
    },
    enumerable: true,
    configurable: true
});

Object.convertRouterPath = function(str){ // 0.2.1
    return str.replace(/[\.\_\s\-]+/gm, '-');
}

function Router(name, path, page){
    this.name = name; // 0.2.1;
    this.path = path.replace(/[\s\_\-\.]+/gm, '-');
    this.page = page;
    this.convertedName = name.replace(/[\s\_\-\.]+/gm, ' '); // 0.2.1
}

// 0.2.1
Router.__proto__.setPage = function(propName, hashPath, page){
    page.created?.call(page);
    hashPath = Object.convertRouterPath(hashPath);
    Router[hashPath] = new Router(propName, `#${hashPath}`, page);
    Router[hashPath].page.origin = Router[hashPath]; // 0.2.1

    Router.loadModules.call(hashPath, false);

    if(Router[hashPath].page.module){ // 서브페이지 모듈 부모 자동 등록
        const modules = Object.keys(Router[hashPath].page.module);
        if(modules.length>0){
            modules.forEach(key=>{
                Router[hashPath].page.module[key].page.parent = Router[hashPath];
            });
        }
    }
}

// 0.2.1
Router.__proto__.setSubPage = function(propName, hashPath, page){
    page.created?.call(page);
    hashPath = Object.convertRouterPath(hashPath);
    Router[hashPath] = new Router(propName, `#${hashPath}`, page);
    Router[hashPath].page.origin = Router[hashPath]; // 0.2.1
    return Router[hashPath];
}

Router.__proto__.setModulePage = function(name, page){
    page.created?.call(page);
    Router.__proto__[name] = new Router(name, '', page);
}

Router.__proto__.loadModules = function (sep = true){
    let root = this;
    function LoadModules(){
        Object.keys(Router).filter(name=>name.match(root)).map(name=>{
            let temp = sep?name:name.replace(/[\s\-\_\.]+/gm, '_');
            this['$'+temp] = Router[name];
        });
    }
    
    Router[this].page.module = new LoadModules();
}

Router.setPage('404', '404', base404);

const Route = (function (){
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
            current = href;//.removeSign();
            this.fakeLocation(current);
            this.renderView(current);
        }

        this.fakeLocation = function (href){
            history.pushState({page: href}, '', href);
        }

        this.renderView = function (href){
            const name = href.slice(1);//.removeSign();
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
                    .Layout
                    .template()
                    .setPage(parts.router[name], parts.router)
                    .convert()
                    .setLocalStyle()
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

const Layout = {
    module: {},
    originView: null,
    convertedView: [],
    setLocalStyle: function (){
        const rootPage = Router[this.getPage].page;
        let vmBody = new DOMParser().parseFromString(this[this.getPage], 'text/html').body;
        let idx = this.convertedView.indexOf(this[this.getPage]);

        if(rootPage.style)
        Object.keys(rootPage.style)?.forEach(name => {
            const styles = Object.entries(rootPage.style[name]);
            styles.forEach(([key, val])=>{
                vmBody.querySelectorAll(name).forEach(el => {
                    el.style.setProperty(key, val);
                });
            });
        });
        
        this.convertedView[idx] = vmBody.innerHTML;

        return this;
    },
    setPage: function(page, router){
        this.convertedView = [];
        if(!page) page = router['404'];
        Route[page.path] = page;
        this.getPage = page.path.slice(1); // 0.2.1
        return this;
    },
    getPage: null,
    template: function (template) {
        if(template) this.originView = template;
        return this;
    },
    render(){
        const rootPage = Router[this.getPage].page;
        
        rootPage.mounted?.call(rootPage);

        return this.convertedView.join('');
    }
}

export {
    Router,
    App,
    Route,
    Layout,
}