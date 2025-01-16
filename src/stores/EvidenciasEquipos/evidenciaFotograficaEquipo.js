import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEvidenciaFotograficaEquipoStore = defineStore('evidenciaFotograficaEquipo', () => {

    const imagesSource = ref([])

    const cleanImagesSource = () => {
        imagesSource.value = []
    }

    return {
        imagesSource,
        cleanImagesSource
    }
  
})