<script setup lang='ts'>
import type { IPasswordUpdate } from '@/assets/Interfaces/IPasswordUpdate';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue'

// stores
const userStore = useUserStore()

const passwordUpdate = ref<IPasswordUpdate>({
    oldPassword: '',
    newPassword: ''
})

const submitForm = () => {
    userStore.passwordUpdate(passwordUpdate.value)

    passwordUpdate.value.oldPassword = ''
    passwordUpdate.value.newPassword = ''
}
</script>

<template>
    <!-- Modal -->
    <div data-te-modal-init
        class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="updatePassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div data-te-modal-dialog-ref
            class="text-white pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
            <div
                class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none  bg-gray-700 bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                <div
                    class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                    <!--Modal title-->
                    <h5 class="text-xl font-medium leading-normal text-white" id="exampleModalLabel">
                        Change Password
                    </h5>
                    <!--Close button-->
                    <button type="button"
                        class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                        data-te-modal-dismiss aria-label="Close">
                        <font-awesome-icon icon="fa-solid fa-x" />
                    </button>
                </div>

                <!--Modal body-->
                <div class="relative flex-auto p-4 font-semibold" data-te-modal-body-ref>
                    <form class="space-y-6" @submit.prevent="submitForm">
                        <div>
                            <label for="old"
                                class="block mb-2 text-sm font-medium text-white dark:text-white">Old Password</label>
                            <input type="password" id="old"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required v-model="passwordUpdate.oldPassword">
                        </div>
                        <div>
                            <label for="new" class="block mb-2 text-sm font-medium text-white dark:text-white">New Password</label>
                            <input type="password" id="new"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required v-model="passwordUpdate.newPassword">
                        </div>
                        <div class="bg-red-800 text-white p-3 rounded-md mb-3" v-if="userStore.passwordUpdateErrors.length">
                            <p v-for="error in userStore.passwordUpdateErrors">{{ error }}</p>
                        </div>
                        <button type="submit"
                            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Change
                        </button>
                    </form>
                </div>

                <!--Modal footer-->
                <div
                    class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                    <button type="button" data-te-modal-dismiss
                        class="bg-gray-500 p-3 rounded-md hover:bg-gray-600 w-36 mr-3">
                        Cancle
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
    
<style></style>