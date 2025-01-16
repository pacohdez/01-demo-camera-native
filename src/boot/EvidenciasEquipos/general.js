import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios';

export const useGeneralStore = defineStore('general', () => {

  const orden = ref({
    "numero_orden": '',
    "descripcion": '',
    "numero": '',
    "giro": '',
    "cliente": '',
  })
  const obj_orden_edited = ref({
    "numero_orden": '',
    "descripcion": '',
    "numero": '',
    "giro": '',
    "cliente": '',
  })
  const ordenes = ref([])

  const getBuscarOrden = async (numero_orden) => {
    try {
      const res = await api.get(`/general/ordenes/numero?numeroOrden=${numero_orden}`)
      Object.assign(orden.value, res.data)
      Object.assign(obj_orden_edited.value, res.data)

      return res.status

    } catch (error) {
      cleanOrden()

      return error.status
    }
  }

  const getConsultaOrdenes = async () => {
    try {
      const res = await api.get(`/general/ordenes`)
      ordenes.value = res.data

      return res.status

    } catch (error) {

      return error.status
    }
  }

  const cleanOrden = () => {
    let obj_clean_orden = {
      "numero_orden": '',
      "descripcion": '',
      "numero": '',
      "giro": '',
      "cliente": '',
    }

    Object.assign(orden.value, obj_clean_orden)
    Object.assign(obj_orden_edited.value, obj_clean_orden)
  }

  return {
    orden,
    obj_orden_edited,
    ordenes,
    getBuscarOrden,
    getConsultaOrdenes,
    cleanOrden,
  }
  
})
