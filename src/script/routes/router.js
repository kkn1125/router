'use strict';
import App from '../core/app.js';
import Router from '../core/core.js'
import Home from '../pages/home.js'
import About from '../pages/about.js'

const home = new Router('home', '', Home);
const about = new Router('about', '', About);

Router.home = home;
Router.about = about;

export default{
    home,
    about,
}