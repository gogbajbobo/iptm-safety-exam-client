<script>

    import _ from 'lodash'

    import store from '@/store'
    import { actions, getters } from '@/store/constants'

    import router from '@/router'
    import { paths } from '@/router/paths'

    import { helper } from '@/services/helper'

    import QuestionList from '../Questions/QuestionList'


    export default {

        name: 'ExamForm',

        components: { QuestionList },

        props: {
            examId: { type: String },
        },

        data() {
            return {
                examForm: {
                    title: null,
                },
                formIsPristine: true,
            }
        },

        computed: {

            exams() { return store.getters[getters.exams] },
            exam() { return this.exams.find(exam => exam.id === Number(this.examId)) },

            legendTitle() {

                return this.exam
                    ? `Экзамен ${ this.exam?.id }: ${ this.exam?.title }:`
                    : 'Новый экзамен:'

            },

        },

        mounted() {
            this.refreshExamForm()
        },

        methods: {

            refreshExamForm() { this.examForm = { ...this.exam } },

            submitAction() {

                const examAction = this.exam ? actions.updateExam : actions.createExam

                const action = store.dispatch(examAction, this.examForm)
                    .then(exam => {
                        this.examId
                            ? this.refreshExamForm()
                            : router.push({ path: `${ paths.EXAM_FORM }/${ exam?.id }` }).then(this.refreshExamForm)
                    })
                    .catch(err => alert(err))

                return helper.loaderWithAction(this, action)

            },

            submitExamButtonPressed() { return helper.loaderWithAction(this, this.submitAction()) },

            examsButtonPressed() { router.push({ path: paths.EXAM_LIST }) },

        },

        watch: {

            examForm: {
                handler: function () {
                    this.formIsPristine = this.exam ? _.isEqual(this.examForm, this.exam) : !this.examForm.title
                },
                deep: true,
            }

        }

    }

</script>

<template>

    <div>

        <button @click="examsButtonPressed">Экзамены</button>

        <fieldset>

            <legend>{{ legendTitle }}</legend>

            <label for="title">Название: </label>
            <input type="text" name="title" id="title" required v-model="examForm.title" />
            <button @click="submitExamButtonPressed" :disabled="formIsPristine">Сохранить</button>

            <div v-if="exam">
                <hr>
                Вопросы:
                <hr>
                <question-list :exam-id="examId"></question-list>
            </div>

        </fieldset>

    </div>

</template>

<style scoped>

</style>