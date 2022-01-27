import {Router, Route, Layout} from '../../src/core/core.js'
import router from '../../src/routes/router.js'

Route.init({
    el: '#app',
    Layout,
    router,
})