import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios';

export const useEvidenciasComponentesStore = defineStore('evidenciasComponentes', () => {

    const postEvidenciasComponentes = async (formData) => {
        try {
            const res = await api.post(`/diagnostico/evidencias-componentes`, formData)

            return res.status

        } catch (error) {
            return error.status
        }
    }

    return {
        postEvidenciasComponentes
    }

})
