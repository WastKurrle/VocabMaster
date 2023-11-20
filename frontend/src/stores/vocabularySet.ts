import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import axios from "axios";
import type { IVocabSet } from "@/assets/Interfaces/IVocabSet";
import { toast } from "vue3-toastify";
import { usePracticeRoomStore } from "./practiceRoom";

export const useVocabularySetStore = defineStore('vocabularySet', () => {
    // stores
    const practiceRoomStore = usePracticeRoomStore()
    
    // Error lists
    const createVocabSetErrors = reactive(Array())

    // lists
    const roomVocaublarySets = reactive<Array<IVocabSet>>(Array<IVocabSet>())

    // API Call functions

    /*
        Sends an API request to create a vocabulary set
    */
    const createVocabularySet = async (vocabSetForm:IVocabSet) => {
        createVocabSetErrors.length = 0

        await axios
                .post('/api/set/', vocabSetForm)
                .then(response => {
                    toast.success('Vocabulary Set Created!', { autoClose: 3000 })
                    getAllVocaublarySetsFromPracticeRoom(practiceRoomStore.currentPracticeRoom.id)
                })
                .catch(error => {
                    if (error.response) {
                        // Loops the server errors and push it in the errors array
                        for (const property in error.response.data.status) {
                            createVocabSetErrors.push(
                                `${property}: ${error.response.data.status[property]}`
                            );
                        }
                      }
                })
    }

    const getAllVocaublarySetsFromPracticeRoom = async (roomId:string) => {
        roomVocaublarySets.length = 0

        await axios
                .get(`/api/set/?roomId=${roomId}`)
                .then(response => {
                    const result:Array<any> = response.data
                    fillRoomVocabularySetsList(result)
                })
                .catch(error => {
                    toast.error('Something went wrong', { autoClose: 3000 })
                })
    }

    // Helper functions

    /*
        Fills the roomVocaublarySet list with IVocabSet objects from the api response
    */
    const fillRoomVocabularySetsList = (res:Array<any>):void => {
        res.map(set => {
            roomVocaublarySets.push({
                id: set.id,
                name: set.name,
                description: set.description,
                room: set.room
            })
        })
    }

    return {
        // Vars
            createVocabSetErrors,
            roomVocaublarySets,

        // Functions
            createVocabularySet,
            getAllVocaublarySetsFromPracticeRoom
    }
})
