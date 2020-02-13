import Vue from 'vue'
import Vuex from 'vuex'
import PersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'
import { mutations, actions } from '@/store/constants'
import { login } from '@/services/requests'
import { openSocket, closeSocket } from '@/socket'


Vue.use(Vuex)

const initialState = {
    user: null
}

const store = new Vuex.Store({

    modules: {
    },

    state: initialState,

    mutations: {
        [mutations.login]: (state, user) => { state.user = user },
    },

    actions: {

        [actions.login]: ({ commit }, { username, password }) => {

            return login({ username, password })
                .then(user => commit(mutations.login, user))
                .catch(() => {})

        },

    },

    plugins: [
        PersistedState(),
        createMutationsSharer({ predicate: [] }),
    ],

    strict: process.env.NODE_ENV !== 'production'

})

store.watch(
    state => state.user,
    user => user ? openSocket().connect() : closeSocket()
)


export default store
