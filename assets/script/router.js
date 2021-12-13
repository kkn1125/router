'use strict';

const Router = (function () {
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

        this.handleBeforePage = function (ev) {
            models.handleBeforePage(location.hash);
        }

        this.handleSideMenu = function (ev) {
            const target = ev.target;
            const menuWrap = target.closest('.side-menu');
            const sibling = document.querySelector('#side-menu');

            if (!menuWrap && sibling && sibling.className !== 'show') return;

            models.handleSideMenu(menuWrap, sibling);
        }

        this.handlePaging = function (ev) {
            const target = ev.target;
            const data = target.dataset;

            if (target.tagName !== 'BUTTON' || !data.dir) return;

            models.handlePaging(target);
        }

        this.handleLink = function (ev) {
            const anchor = ev.target;

            if (anchor.getAttribute('href') && anchor.getAttribute('href').indexOf('http') > -1) {
                ev.preventDefault();
                window.open(anchor.href);
            }
        }

        this.handleLoad = function (ev) {
            const href = location.hash == '' || location.hash == '#' ? '#home' : location.hash;
            models.routeAnchor(href);
        }

        this.blockRoutAnchor = function (ev) {
            const anchor = ev.target;
            const href = anchor.hash;

            if (ev.which == 4 || ev.which == 5) {
                setTimeout(function () {
                    models.forwardAnchor(location.hash);
                }, 10)
            }

            if (anchor.tagName !== 'A' || !anchor.getAttribute('href').match(/\#/gm)) return;
            ev.preventDefault();

            models.routeAnchor(href);
        }
    }

    function Model() {
        let views = null;
        let currentPage = null;
        let motion = null;
        let beforePage = null;
        let moduler = null;

        let pages = null;
        // Object.keys(router).filter(page=>page!='404');
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

        this.init = function (view, modules) {
            views = view;
            moduler = modules;

            pages = Object.keys(moduler.router).filter(page => page != '404');
            this.filterHash();
        }

        this.handleBeforePage = function (page) {
            beforePage = page;
        }

        this.handleSideMenu = function (target, sibling) {
            sibling.classList.toggle('show');

            document.querySelector('.menu').innerHTML = sibling.className !== 'show' ? `<i class="fas fa-bars fa-2x"></i>` : '<i class="fas fa-times fa-2x"></i>';
        }

        this.handlePaging = function (target) {
            const className = target.dataset.dir;
            const alerting = (page = false) => {
                let hasNotice = document.querySelector('.notice');
                let notice = target.parentNode.insertAdjacentElement('afterend', document.createElement('div'));

                notice.innerHTML = `<span>${page?'메인':'마지막'} 페이지입니다.</span>`;
                notice.classList.add('show', 'notice');

                if (hasNotice) hasNotice.remove();

                setTimeout(() => {
                    notice.classList.remove('show');
                    notice.classList.add('hide');
                    setTimeout(() => {
                        notice.remove();
                    }, 1000);
                }, 3000);
            }

            let pageIdx = pages.indexOf(currentPage);


            if (className == 'prev') {
                if (pageIdx - 1 < 0) {
                    pageIdx = pageIdx;
                    alerting(true);
                    return;
                } else {
                    pageIdx = pageIdx - 1
                }
            } else {
                if (pageIdx + 1 > pages.length - 1) {
                    pageIdx = pageIdx;
                    alerting(false);
                    return;
                } else {
                    pageIdx = pageIdx + 1;
                }
            }

            this.routeAnchor(`#${pages[pageIdx]}`);
        }

        this.filterHash = function () {
            currentPage = pages[pages.indexOf(location.hash.substring(1))];
            if (!currentPage) history.replaceState({}, '', '#home');
        }

        this.forwardAnchor = function (href) {
            currentPage = href;
            this.renderingCurrentPage();
        }

        this.routeAnchor = function (href) {
            history.pushState({}, '', `${href}`);
            currentPage = href.slice(1);
            this.renderingCurrentPage();
        }

        this.renderingCurrentPage = function () {
            this.filterHash();
            this.getRandomMotion();

            if (beforePage && beforePage.substring(1) == currentPage) return;
            views.renderingCurrentPage(currentPage, motion);
        }

        this.getRandomMotion = function () {
            motion = state.animations[parseInt(Math.random() * state.animations.length)];
        }
    }

    function View() {
        let moduler = null;
        let app = null;

        this.init = function (components) {
            moduler = components;

            app = document.querySelector('#app');

            this.changeTitle(location.hash.slice(1));
        }

        this.extandsSettings = function (args, response, motion) {
            this.baseExtands(args, response);
            this.pageRendering(args, motion);
        }

        this.baseExtands = function (args, response) {
            Object.assign(args, {
                page: response,
            });
        }

        this.pageRendering = async function (args, motion) {
            let result = await fetch(`pages/${location.hash.slice(1)}.html`);
            let text = await result.text();
            text = text.replace(/\$\{([\s\S]+?)\}/gm, (a, b) => {
                return new Function('args', `return args['${b}']?args['${b}']:${b}`)(args);
            });

            app.insertAdjacentHTML('afterbegin', `<div class="${motion}">
                ${text}
            </div>`);

            setTimeout(() => {
                this.clearPage();
                this.renderingInitialItems();
            });
        }

        this.renderingInitialItems = function () {
            for (let type in moduler.parts) {
                moduler.pages.item(type).render(type, this.renderingInitailSettings.bind(this));
            }
        }

        this.renderingInitailSettings = async function (args, hash) {
            Object.assign(args, {
                hash: hash,
                pagelist: Object.keys(moduler.router).filter(page => page != '404'),
                isStart: Object.keys(moduler.router).filter(page => page != '404').indexOf(location.hash.slice(1)),
                list: Object.keys(moduler.router).filter(page => page != '404').map(page => `<li><a href="#${page}" class="page">${page}</a></li>`).join(''),
            });

            let result = await fetch(`parts/${hash}.html`);
            let text = await result.text();
            text = text.replace(/\$\{([\s\S]+?)\}/gm, (a, b) => {
                return new Function('args', `return ${args[b]?`args['${b}']`:`${b}`}`)(args);
            });

            app.insertAdjacentHTML('beforeend', `${text}`);
        }

        this.renderingCurrentPage = function (currentPage, motion) {
            this.changeTitle(currentPage);

            try {
                moduler.router[currentPage].select(currentPage).render(moduler.router[currentPage], currentPage, motion, this.extandsSettings.bind(this));
            } catch (e) {
                moduler.router['404'].select('404').render(e, '404', motion, this.extandsSettings.bind(this));
            }
        }

        this.clearPage = function () {
            const oldPage = app.querySelectorAll('#app>div:not(:first-child)');
            const oldSide = app.querySelectorAll(`[class*="side-"], [id="side-menu"]`);

            oldPage.forEach(old => {
                const childrenCount = app.children.length;
                const oldClass = old.classList.value;
                if (!oldClass.match(/[\w]+-[\w]+/gm)) {
                    if (childrenCount > 1) old.classList.replace(oldClass, `out-${oldClass}`);

                    setTimeout(() => {
                        if (childrenCount > 1) old.remove();
                    }, 1000);
                }
            });

            oldSide.forEach(old => {
                old.remove();
            });
        }

        this.changeTitle = function (title) {
            document.title = title;
        }
    }

    return {
        init: function (options) {
            const pages = {
                type: (type) => options.templates[type],
                item: (type) => options.parts[type],
            };

            for (let page in options.router) {
                options.router[page] = {
                    referrer: document.referrer,
                    select: (page) => pages.type(page)
                }
            }

            const moduler = {
                router: options.router,
                pages,
                parts: options.parts,
            };

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(moduler);
            model.init(view, moduler);
            controller.init(model);
        }
    }
})();