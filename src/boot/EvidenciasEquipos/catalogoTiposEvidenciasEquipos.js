import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios';

export const useCatalogoTiposEvidenciasStore = defineStore('catalogoTiposEvidenciasEquipos', () => {

    const tipo_seleccionado = ref(null)
    const tipos_evidencias = ref([])

    const getCatalogoTiposEvidencias = async () => {
        try {
            const res = await api.get(`/diagnostico/evidencias-componentes/catalogo/tipos`)
            tipos_evidencias.value = res.data

            return res.status

        } catch (error) {
            return error.status
        }
    }
    const cleanTiposEvidencias = () => {
        tipo_seleccionado.value = null
    }

    return {
        tipos_evidencias,
        tipo_seleccionado,
        getCatalogoTiposEvidencias,
        cleanTiposEvidencias
    }

})
