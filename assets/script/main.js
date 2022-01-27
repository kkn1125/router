import {Router, Route, Layout} from '../../src/core/core.js'
import router from '../../src/routes/router.js'
// import layout from '../../src/core/layout.js'
console.log(Layout.originView)
Route.init({
    el: '#app',
    Layout,
    router,
})