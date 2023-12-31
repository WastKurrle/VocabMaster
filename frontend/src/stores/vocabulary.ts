import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from "axios";
import type { IVocabulary } from "@/assets/Interfaces/IVocabulary";
import { toast } from "vue3-toastify";
import { useVocabularySetStore } from "./vocabularySet";


export const useVocabularyStore = defineStore('vocabulary', () => {
    // stores
    const vocabularySetStore = useVocabularySetStore()

    // Error lists
    const createVocabularyErrors = reactive(Array())

    // Lists
    const setVocabulary = reactive(Array<IVocabulary>())

    // API Calls

    const createVocabulary = async (vocabularyForm: IVocabulary) => {
        await axios
            .post('/api/vocabulary/', vocabularyForm)
            .then(response => {
                toast.success('Added Vocabulary', { autoClose: 3000 })
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    const getAllVocabularyFromSet = async () => {
        setVocabulary.length = 0

        await axios
            .get(`/api/vocabulary/?setId=${vocabularySetStore.currentVocabularySet?.id}`)
            .then(response => {
                const result: Array<any> = response.data
                fillsetVocabulary(result)
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    const updateVocabulary = (updatedVocabulary:IVocabulary) => {
        axios
            .put(`/api/vocabulary/${updatedVocabulary.id}/`, updatedVocabulary)
            .catch(error => {
                toast.error(`Vocabulary ${updatedVocabulary.nativeWord} - ${updatedVocabulary.foreignWord} not updated!`)
            })
    }

    const deleteVocabulary = (vocabId:string) => {
        axios
            .delete(`/api/vocabulary/${vocabId}/`)
            .then(response => {
                toast.warning('Vocabulary deleted', { autoClose: 3000 })
                getAllVocabularyFromSet()
            })
            .catch(error => {
                toast.error('Something went wrong', { autoClose: 3000 })
            })
    }

    const fillsetVocabulary = (res: Array<any>): void => {
        res.map(voc => {
            setVocabulary.push({
                id: voc.id,
                nativeWord: voc.nativeWord,
                foreignWord: voc.foreignWord,
                vocabSet: voc.vocabSet
            })
        })
    }

    return {
        // Vars
        createVocabularyErrors,
        getAllVocabularyFromSet,
        updateVocabulary,
        deleteVocabulary,

        // Functions
        createVocabulary,
        setVocabulary
    }
})
