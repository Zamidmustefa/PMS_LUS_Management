import Vue from 'vue'
import VueRouter from 'vue-router'
import { app } from 'src/boot/firebase'
import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function( /* { store, ssrContext } */ ) {
    const Router = new VueRouter({
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes,

        // Leave these as they are and change in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE
    })
    Router.beforeEach(async(to, from, next) => {
        let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        let requiresGuest = to.matched.some((x) => x.meta.requiresVisitor);
        app.auth().onAuthStateChanged((user) => {
            if (requiresAuth && !user) {
                next('/login')
            } else if (requiresGuest && user) {
                next("/")
            } else {
                next()
            }
        });
    })
    return Router
}