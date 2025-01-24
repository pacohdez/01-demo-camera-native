import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useComponentesEquipoStore = defineStore('componentesEquipo', () => {

    const componenteSeleccionado = ref(null)
    const listComponentes = ref([
        
    ])
    const cleanComponenteSeleccionado = () => {
        componenteSeleccionado.value = null
    }
    const addListadoComponente = (componente) => {
        listComponentes.value.push(componente)
    }

    return {
        componenteSeleccionado,
        listComponentes,
        cleanComponenteSeleccionado,
        addListadoComponente
    }
  
})
