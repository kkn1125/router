'use strict';

import Router from './Route.js'
import router from '../routes/router.js'

export default {
    module: {},
    originView: null,
    convertedView: null,
    setPage: function(page){
        if(!page) page = router['404'];
        Router[page.name] = page;
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