import {Router, Route, Layout} from '../../src/core/busCore.js'
import router from '../../src/routes/router.js'
// import layout from '../../src/core/layout.js'

Route.init({
    el: '#app',
    Layout,
    router,
})