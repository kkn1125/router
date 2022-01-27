'use strict';
const App = {
    brand: 'Router',
    version: '0.1.0'
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
    fetch('https://cdn.jsdelivr.net/gh/kkn1125/router@latest/src/core/core.js')
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
        console.log(this)
        console.log(this.originView)
        this.convertedView = this.originView.replace(/\{\{([\s\S]+?)\}\}/gm, function (a,b) {
            if(b=='page') b = root.getPage;
            if(Router[b]) {
                return Router[b].page.template();
            }
            else return a;
        });
        return this;
    },
    enumerable: true,
    configurable: true
});

if(!Object.prototype.hasOwnProperty('removeSign'))
Object.defineProperty(Object.prototype, 'removeSign', {
    value: function (){
        return this.replace(/[\.\-\_]+/gm,'');
    },
    enumerable: true,
    configurable: true
});

function Router(name, path, page){
    this.name = name;
    this.path = path;
    this.page = page;
}

Router.__proto__.setPage = function(name, page){
    Router[name] = new Router(name, '', page);
}

Router.__proto__.setModulePage = function(name, page){
    Router.__proto__[name] = new Router(name, '', page);
}

Router.setPage('404', base404);

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
                    .Layout
                    .template()
                    .setPage(parts.router[name], parts.router)
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

const Layout = {
    module: {},
    originView: null,
    convertedView: null,
    setPage: function(page, router){
        if(!page) page = router['404'];
        Route[page.name] = page;
        this.getPage = page.name;
        return this;
    },
    getPage: null,
    template: function (template) {
        if(template) this.originView = template;
        return this;
    },
    render(){
        return this.convertedView;
    }
}

export {
    Router,
    App,
    Route,
    Layout,
}