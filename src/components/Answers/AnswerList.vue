<script>

import store from '@/store'
import { actions, getters } from '@/store/constants'
import { helper } from '@/services/helper'

import router from '@/router'
import { paths } from '@/router/paths'

import { messages } from '@/services/messages'

import AnswerItem from '@/components/Answers/AnswerItem'


export default {

    name: 'AnswerList',

    components: { AnswerItem },

    props: {
        examId: { type: [ String, Number ] },
        questionId: { type: [ String, Number ] },
    },

    computed: {
        answers() { return store.getters[getters.answers] },
    },

    beforeCreate() {
        store.dispatch(actions.flushAnswers)
    },

    mounted() {
        this.getAnswers()
    },

    methods: {

        getAnswers() {

            const action = store.dispatch(actions.getAnswers, { question: this.questionId })
            return helper.loaderWithAction(this, action)

        },

        addAnswerButtonPressed() {
            router.push({ path: `${ paths.ANSWER_FORM }/${ this.examId }/${ this.questionId }` })
        },

        editAnswerButtonPressed(answer) {
            router.push({ path: `${ paths.ANSWER_FORM }/${ this.examId }/${ this.questionId }/${ answer.id }` })
        },

        deleteAnswerButtonPressed(answer) {

            if (messages.confirm(`Удалить ответ ${ answer.text }?`)) {
                return helper.loaderWithAction(this, store.dispatch(actions.deleteAnswer, answer.id))
            }

        },

        correctAnswerSelected(answer) {

            const action = store.dispatch(
                actions.setAnswerAsCorrect,
                { id: answer.id, question: this.questionId }
            )
            return helper.loaderWithAction(this, action)

        },

    },

}

</script>

<template>

    <div>

        <template v-for="(answer, index) in answers">

            <answer-item :key="answer.id"
                         :answer="answer"
                         :index="index+1"
                         @edit-answer="editAnswerButtonPressed(answer)"
                         @delete-answer="deleteAnswerButtonPressed(answer)"
                         @correct-answer-selected="correctAnswerSelected(answer)">

            </answer-item>

        </template>

        <button @click="addAnswerButtonPressed">Добавить ответ</button>

    </div>

</template>

<style scoped>

</style>