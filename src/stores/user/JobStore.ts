import { defineStore } from "pinia";
import { computed, onMounted, watch, watchEffect } from "vue";

export const useJobStore = defineStore('job', () => {
    
    const checkAuth = computed<boolean>(() => {
        const user = localStorage.getItem('user')
        if (user) {
            return true
        }
        return false
    })

    watchEffect(() => {
        checkAuth
    })


    return { checkAuth }

})