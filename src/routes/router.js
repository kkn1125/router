'use strict';
import {Router, Layout} from '../core/busCore.js'
// import layout from '../core/layout.js'

import Home from '../../views/pages/home.js'
import About from '../../views/pages/about.js'
import Notfound from '../../views/pages/404.js'

import nav from '../../views/common/nav.js'
import footer from '../../views/common/footer.js'

Router.setPage('home', Home);
Router.setPage('about', About);
// Router.setPage('404', Notfound);

Router.setModulePage('nav', nav);
Router.setModulePage('footer', footer);

Layout.module = {
    nav, footer
}

Layout.template(`
    {{nav}}
    {{page}}
    {{footer}}
`);

console.log(Layout.originView)

export default {
    ...Router
}