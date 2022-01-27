import Route from '../../src/core/Route.js'
import router from '../../src/routes/router.js'
import layout from '../../src/core/layout.js'

Route.init({
    el: '#app',
    layout,
    router,
})