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

Object.defineProperty(Object.prototype, 'convert', {
    value: function (){
        let root = this;
        this.convertedView = this.originView.replace(/\{\{([\s\S]+?)\}\}/gm, function (a,b) {
            if(b=='page') b = root.getPage;
            if(Router[b]) {
                return Router[b].page.template();
            }
            else return a;
        });
        return this;
    }
});

Object.defineProperty(Object.prototype, 'removeSign', {
    value: function (){
        return this.replace(/[\.\-\_]+/gm,'');
    }
});

export {
    Router,
    App
}