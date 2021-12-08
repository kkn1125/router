'use strict';

(function () {
    function Controller() {
        let models = null;

        this.init = function (model) {
            models = model;

            window.addEventListener('load', this.handleLoad);
            window.addEventListener('mouseup', this.blockRoutAnchor);
            window.addEventListener('mousedown', this.handleBeforePage);
            window.addEventListener('click', this.handleLink);
            window.addEventListener('click', this.handlePaging);
            window.addEventListener('click', this.handleSideMenu);
        }

        this.handleBeforePage = function(ev){
            models.handleBeforePage(location.hash);
        }

        this.handleSideMenu = function(ev){
            const target = ev.target;
            const menuWrap = target.closest('.side-menu');
            const sibling = document.querySelector('#side-menu');

            if(!menuWrap && sibling.className !== 'show') return;

            models.handleSideMenu(menuWrap, sibling);
        }

        this.handlePaging = function(ev){
            const target = ev.target;
            const data = target.dataset;

            if(target.tagName !== 'BUTTON' || !data.dir) return;

            models.handlePaging(target);
        }

        this.handleLink = function(ev){
            const anchor = ev.target;

            if(anchor.getAttribute('href') && anchor.getAttribute('href').indexOf('http')>-1){
                ev.preventDefault();
                window.open(anchor.href);
            }
        }

        this.handleLoad = function (ev) {
            const href = location.hash == '' || location.hash == '#'?'#home':location.hash;
            models.routeAnchor(href);
        }

        this.blockRoutAnchor = function(ev){
            const anchor = ev.target;
            const href = anchor.hash;

            if(ev.which == 4 || ev.which == 5){
                setTimeout(function(){
                    models.forwardAnchor(location.hash);
                },10)
            }

            if(anchor.tagName !== 'A' || !anchor.getAttribute('href').match(/\#/gm)) return;
            ev.preventDefault();

            models.routeAnchor(href);
        }
    }

    function Model() {
        const pages = Object.keys(router).filter(page=>page!='404');

        let views = null;
        let currentPage = null;
        let motion = null;
        let beforePage = null;

        const state = {
            animations: [
                'fade',
                'zoom',
                'start',
                'end',
                'top',
                'bottom',
            ],
            view: 'animation',
        };

        this.init = function (view) {
            views = view;

            this.filterHash();
        }

        this.handleBeforePage = function(page){
            beforePage = page;
        }

        this.handleSideMenu = function(target,sibling){
            sibling.classList.toggle('show');

            document.querySelector('.menu').innerHTML = sibling.className!=='show'?`<i class="fas fa-bars fa-2x"></i>`:'<i class="fas fa-times fa-2x"></i>';
        }

        this.handlePaging = function(target){
            const className = target.dataset.dir;
            const alerting = (page=false)=>{
                let hasNotice = document.querySelector('.notice');
                let notice = target.parentNode.insertAdjacentElement('afterend', document.createElement('div'));

                notice.innerHTML = `<span>${page?'메인':'마지막'} 페이지입니다.</span>`;
                notice.classList.add('show', 'notice');

                if(hasNotice) hasNotice.remove();

                setTimeout(()=>{
                    notice.classList.remove('show');
                    notice.classList.add('hide');
                    setTimeout(()=>{
                        notice.remove();
                    }, 1000);
                }, 3000);
            }
            
            let pageIdx = pages.indexOf(currentPage);

            
            if(className == 'prev'){
                if(pageIdx-1<0){
                    pageIdx = pageIdx;
                    alerting(true);
                    return;
                } else {
                    pageIdx = pageIdx-1
                }
            } else {
                if(pageIdx+1>pages.length-1){
                    pageIdx = pageIdx;
                    alerting(false);
                    return;
                } else {
                    pageIdx = pageIdx+1;
                }
            }
            
           this.routeAnchor(`#${pages[pageIdx]}`);
        }

        this.filterHash = function(){
            currentPage = pages[pages.indexOf(location.hash.substring(1))];
        }

        this.forwardAnchor = function(href){
            currentPage = href;
            this.renderingCurrentPage();
        }
        this.routeAnchor = function(href){
            history.pushState({}, '', `${href}`);
            currentPage = href;
            this.renderingCurrentPage();
        }

        this.renderingCurrentPage = function(){
            this.filterHash();
            this.getRandomMotion();


            if(beforePage && beforePage.substring(1) == currentPage) return;
            views.renderingCurrentPage(currentPage, motion);
        }

        this.getRandomMotion = function(){
            motion = state.animations[parseInt(Math.random()*state.animations.length)];
        }
    }

    function View() {
        let moduler = null;
        let app = null;

        this.init = function (components) {
            moduler = components;

            app = document.querySelector('#app');

            this.changeTitle(location.hash);
        }

        this.renderingInitialItems = function(){
            for(let type in parts){
                app.insertAdjacentHTML('beforeend', moduler.pages.item(type).render(location.hash));
            }
        }

        this.renderingCurrentPage = function(currentPage, motion){
            this.changeTitle(currentPage);
            
            try{
                app.insertAdjacentHTML('afterbegin', `<div class="${motion}">
                    ${moduler.router[currentPage].select(currentPage).render(moduler.router[currentPage], currentPage)}
                    </div>`);
            } catch(e){
                app.insertAdjacentHTML('afterbegin', `<div class="${motion}">
                    ${moduler.router['404'].select('404').render(e, '404')}
                    </div>`);
            }

            this.clearPage();
            this.renderingInitialItems();
        }

        this.clearPage = function(){
            const oldPage = app.querySelectorAll('#app>div:not(:first-child)');
            const oldSide = app.querySelectorAll(`[class*="side-"], [id="side-menu"]`);

            oldPage.forEach(old=>{
                const childrenCount = app.children.length;
                const oldClass = old.classList.value;
                if(!oldClass.match(/[\w]+-[\w]+/gm)){
                    if(childrenCount>1) old.classList.replace(oldClass,`out-${oldClass}`);
        
                    setTimeout(()=>{
                        if(childrenCount>1) old.remove();
                    },1000);
                }
            });

            oldSide.forEach(old=>{
                old.remove();
            });
        }

        this.changeTitle = function(title){
            document.title = title;
        }
    }

    return {
        init: function () {
            const moduler = {
                router,
                pages,
            }

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(moduler);
            model.init(view);
            controller.init(model);
        }
    }
})().init();