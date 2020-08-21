import Vue from 'vue'
import Vuex from 'vuex'
import PersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'

import { mutations, actions, getters } from '@/store/constants'

import { login, logout } from '@/services/requests'
import EventBus, { events } from '@/services/event.bus'

import { sendMessageToServer as send } from '@/socket'


Vue.use(Vuex)

const initialState = {

    user: null,
    exams: [],
    questions: [],

}

const store = new Vuex.Store({

    modules: {
    },

    state: initialState,

    mutations: {

        [mutations.setUser]: (state, user) => state.user = user,

        [mutations.setExams]: (state, exams) => state.exams = exams,

        [mutations.addExam]: (state, exam) => state.exams.push(exam),

        [mutations.replaceExam]: (state, exam) => state.exams = state.exams.map(e => exam.id === e.id ? exam : e),

        [mutations.deleteExam]: (state, id) => state.exams = state.exams.filter(exam => exam.id !== id),

        [mutations.setQuestions]: (state, questions) => state.questions = questions,

    },

    actions: {

        [actions.login]: ({ commit }, { username, password }) => {

            return login({ username, password })
                .then(user => commit(mutations.setUser, user))
                .catch(() => {})

        },

        [actions.logout]: ({ commit }) => {

            commit(mutations.setUser, initialState.user)
            return logout().catch(() => {})

        },

        [actions.createExam]: ({ commit }, payload) => {

            return send({ action: actions.createExam, payload })
                .then(exam => {
                    commit(mutations.addExam, exam)
                    return exam
                })

        },

        [actions.getExams]: ({ commit }) => {

            return send({ action: actions.getExams })
                .then(payload => commit(mutations.setExams, payload))

        },

        [actions.updateExam]: ({ commit }, payload) => {

            return send({ action: actions.updateExam, payload })
                .then(exam => {
                    commit(mutations.replaceExam, exam)
                    return exam
                })

        },

        [actions.deleteExam]: ({ commit }, payload) => {

            return send({ action: actions.deleteExam, payload })
                .then(() => commit(mutations.deleteExam, payload))

        },

        [actions.getQuestions]: ({ commit }, payload) => {

            return send({ action: actions.getQuestions, payload })
                .then(payload => commit(mutations.setQuestions, payload))

        },

    },

    getters: {

        [getters.isAuthorized]: state => Boolean(state.user),

        [getters.user]: state => state.user,

        [getters.exams]: state => state.exams,

        [getters.questions]: state => state.questions,

    },

    plugins: [
        PersistedState(),
        createMutationsSharer({ predicate: [] }),
    ],

    strict: process.env.NODE_ENV !== 'production'

})

store.watch(
    state => state.user,
    user => EventBus.$emit(user ? events.LOGIN : events.LOGOUT),
)


export default store
