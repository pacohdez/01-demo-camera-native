import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios';

export const useComponentesEquipoStore = defineStore('componentesEquipo', () => {

    const componenteSeleccionado = ref(null)
    const catalogoPiezas = ref([])
    const listPiezasSimilares = ref([])
    const listPiezasConEvidenciasOrden = ref([])
    const listEvidenciasPorOrdenPieza = ref([])
    // --------------------------------------------------------------
    const listDetalleEvidenciasOrden = ref([])
    const listDetalleEvidenciasOrdenAgrupadaComponente = ref([])

    const cleanComponenteSeleccionado = () => {
        componenteSeleccionado.value = null
    }
    const asignarComponente = (componente) => {
        componenteSeleccionado.value = componente
    }
    const getCatalogoPiezas = async () => {
        try {
            const res = await api.get(`/diagnostico/evidencias-componentes/catalogo/piezas`)
            catalogoPiezas.value = res.data

            return res.status

        } catch (error) {
            return error.status
        }
    }
    const postGuardarPiezaNueva = async (obj_pieza_nva) => {
        try {
            const res = await api.post('/diagnostico/evidencias-componentes/catalogo/piezas', obj_pieza_nva)
            if(res.status === 201) {
                await getCatalogoPiezas()
                componenteSeleccionado.value = catalogoPiezas.value.slice(-1)[0]
            }

            return res
        } catch (error) {
            if(error.response.status === 409) {
                listPiezasSimilares.value = error.response.data
            }

            return error.response
        }
    }
    const postForzarGuardarPiezaNueva = async (obj_pieza_nva) => {
        try {
            const res = await api.post('/diagnostico/evidencias-componentes/catalogo/piezas?forzarGuardado=true', obj_pieza_nva)
            if(res.status === 201) {
                await getCatalogoPiezas()
                componenteSeleccionado.value = catalogoPiezas.value.slice(-1)[0]
            }

            return res
        } catch (error) {

            return error.response
        }
    }
    const getConsultarPiezasConEvidenciasOrden = async (id_orden) => {
        try {
            const res = await api.get(`/diagnostico/evidencias-componentes/piezas/orden?id_orden=${id_orden}`)
            listPiezasConEvidenciasOrden.value = res.data

            return res
        } catch (error) {
            return error.response
        }
    }
    const getConsultarEvidenciasPorOrdenPieza = async (id_orden, id_pieza) => {
        try {
            const res = await api.get(`/diagnostico/evidencias-componentes/orden/pieza?id_orden=${id_orden}&id_pieza=${id_pieza}`)
            listEvidenciasPorOrdenPieza.value = res.data

            return res
        } catch (error) {
            return error.response
        }
    }
    // ----------------------------------------------------------------------------------------------------
    const getConsultaDetalleEvidenciasOrden = async (id_orden) => {
        try {
            const res = await api.get(`/diagnostico/evidencias-componentes/orden?id_orden=${id_orden}`)
            listDetalleEvidenciasOrden.value = res.data

            return res
        } catch (error) {
            return error.response
        }
    }
    const agruparEvidenciasPorComponente = () => {
        const resultado = listDetalleEvidenciasOrden.value.reduce((acc, item) => {
            const key = item.origen_evidencias_componentes_catalogo_piezas_id;
            if (!acc[key]) {
                acc[key] = {
                    id: key,
                    descripcion: item.descripcion_pieza_evidencias_componente,
                    evidencias: []
                }
            }
            acc[key].evidencias.push(item);
            return acc; // Asegúrate de devolver el acumulador
        }, {}); // Inicializa el acumulador como un objeto vacío

        // Guardar el resultado en la variable reactiva
        listDetalleEvidenciasOrdenAgrupadaComponente.value = Object.values(resultado);
    }

    return {
        componenteSeleccionado,
        listPiezasSimilares,
        catalogoPiezas,
        listPiezasConEvidenciasOrden,
        listEvidenciasPorOrdenPieza,

        listDetalleEvidenciasOrden,
        listDetalleEvidenciasOrdenAgrupadaComponente,
        cleanComponenteSeleccionado,
        asignarComponente,
        getCatalogoPiezas,
        postGuardarPiezaNueva,
        postForzarGuardarPiezaNueva,
        getConsultarPiezasConEvidenciasOrden,
        getConsultarEvidenciasPorOrdenPieza,

        getConsultaDetalleEvidenciasOrden,
        agruparEvidenciasPorComponente
    }
  
})
