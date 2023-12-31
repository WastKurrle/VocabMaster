import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import type { IPracticeRoom } from "@/assets/Interfaces/IPracticeRomm";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useUserStore } from "./user";
import router from "@/router";

export const usePracticeRoomStore = defineStore('practiceRoom', () => {
    // stores
    const userStore = useUserStore()
    
    const practcieRoomCreateErrors = reactive(Array())
    const practiceRoomUpdateErrors = reactive(Array())

    const currentPracticeRoom = ref()

    const userPracticeRomms = reactive(Array())
    const registerdLanguages = reactive([
        {
            name: 'EN',
            img: '/flags/gb.png'
        },
        {
            name: 'GER',
            img: '/flags/ger.png'
        },
        {
            name: 'ESP',
            img: '/flags/esp.png'
        }
    ])

    /*
        Sends an API request to create a langauge practice room
    */
    const createPracticeRoom = async (practiceRoom:IPracticeRoom):Promise<void> => {
        practcieRoomCreateErrors.length = 0

        practiceRoom.owner = userStore.user.id

        await axios
                .post('/api/room/', practiceRoom)
                .then(response => {
                    toast.success('Practice Room Created!', { autoClose: 3000 })
                    getUserPracticeRooms()
                })
                .catch(error => {
                    if (error.response) {
                        // Loops the server errors and push it in the errors array
                        for (const property in error.response.data) {
                            practcieRoomCreateErrors.push(
                                `${property}: ${error.response.data[property]}`
                            );
                        }
                      }
                })
    }

    /*
        Gets all practice rooms from an user from api and fills the 
        user practice room list
    */
    const getUserPracticeRooms = async () => {
        userPracticeRomms.length = 0

        await axios
                .get('/api/room/')
                .then(response => {
                    const result:Array<any> = response.data
                    fillPracticeRoomList(result)
                })
                .catch(error => {
                    toast.error('Something went wrong', { autoClose: 300 })
                })
    }

    /*
        Gets a practice room by the id from the api
    */
    const getPracticeRoomById = async (id:string):Promise<object> => {
        let room = {}

        await axios
                .get(`/api/room/${id}/`)
                .then(response => {
                    room = response.data
                    currentPracticeRoom.value = room
                    localStorage.setItem('currentPracticeRoom', JSON.stringify(room))
                })
                .catch(error => {
                    toast.error('Something went wrong!', { autoClose: 3000 })
                })

        return room
    }

    const updatePracticeRoom = async (updatedPracticeRoom:IPracticeRoom) => {
        practiceRoomUpdateErrors.length = 0

        await axios
                .put(`/api/room/${currentPracticeRoom.value.id}/`, updatedPracticeRoom)
                .then(response => {
                    toast.success('Updated!', { autoClose: 3000 })
                    getPracticeRoomById(String(updatedPracticeRoom.id))
                })
                .catch(error => {
                    if (error.response) {
                        // Loops the server errors and push it in the errors array
                        for (const property in error.response.data) {
                            practiceRoomUpdateErrors.push(
                                `${property}: ${error.response.data[property]}`
                            );
                        }
                      }
                })
    }

    /*
        Delets the current selected practice room
    */
    const deletePracticeRoom = async () => {
        await axios
                .delete(`/api/room/${currentPracticeRoom.value.id}/`)
                .then(response => {
                    router.push({name: 'home'})
                    toast.warning('Langauge Practice Room deleted!', { autoClose: 3000 })
                })
                .catch(error => {
                    toast.error('Something went wrong', { autoClose: 3000 })
                })
    }

    /*
        Fills the user practice room list with IPractieRoom objects
        from the api request result
    */
    const fillPracticeRoomList = (result:Array<any>) => {
        result.map(room => {
            userPracticeRomms.push({
                id: room.id,
                name: room.name,
                language: room.language,
                description: room.description,
                owner: room.owner,
                url: room.get_absolute_url
            })
        })
    }

    return {
        // functions
        createPracticeRoom,
        getUserPracticeRooms,
        getPracticeRoomById,
        updatePracticeRoom,
        deletePracticeRoom,

        // Vars
        practcieRoomCreateErrors,
        practiceRoomUpdateErrors,
        currentPracticeRoom,
        userPracticeRomms,
        registerdLanguages
    }
})
