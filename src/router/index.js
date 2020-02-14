import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import EventBus, { events } from '@/services/event.bus'


Vue.use(Router)

const login = {
    path: '/login',
    name: Login.name,
    component: Login,
    meta: {
        anonymousAccess: true
    }
}

const main = {
    path: '/main',
    name: Main.name,
    component: Main,
    meta: {
        anonymousAccess: true
    }
}

const routes = [
    login,
    main,
]

const router = new Router({
    routes
})

const anonymousAccessRoutes = routes
    .filter(route => route.meta && route.meta.anonymousAccess)
    .map(route => route.name)

router.beforeEach((to, from, next) => {

    const isAuthorized = false

    if (!isAuthorized) {

        if (anonymousAccessRoutes.includes(to.name)) {
            return next()
        } else {
            return next({ name: Login.name })
        }

    }

    return next()

})

const loginHandler = () => router.push({ name: Main.name })
const logoutHandler = () => router.push({ name: Login.name })

EventBus.$on(events.LOGIN, loginHandler)
EventBus.$on(events.LOGOUT, logoutHandler)


export default router
