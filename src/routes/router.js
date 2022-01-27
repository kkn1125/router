'use strict';
import {Router} from '../core/core.js'
import layout from '../core/layout.js'

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

layout.module = {
    nav, footer
}

layout.template(`
    {{nav}}
    {{page}}
    {{footer}}
`);

export default {
    ...Router
}