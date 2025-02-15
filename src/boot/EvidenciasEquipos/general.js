import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios';

export const useGeneralStore = defineStore('general', () => {

  const orden = ref({
    "id": 0,
    "numero_orden": '',
    "descripcion": '',
    "numero": '',
    "giro": '',
    "cliente": '',
  })
  const obj_orden_edited = ref({
    "id": 0,
    "numero_orden": '',
    "descripcion": '',
    "numero": '',
    "giro": '',
    "cliente": '',
  })
  const ordenes = ref([])
  const anios_ordenes = ref([])
  const anio_edited = ref(null)
  const fecha_servidor = ref('')
  const obj_personal = ref({})

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

  const getConsultaAniosOrdenes = async () => {
    try {
      const res = await api.get(`/general/ordenes/años`)
      anios_ordenes.value = res.data
      anio_edited.value = anios_ordenes.value.sort((a, b) => b - a)[0]

      return res.status

    } catch (error) {
      return error.status
    }
  }

  const getConsultaOrdenesAnio = async (anio) => {
    try {
      const res = await api.get(`/general/ordenes/filtradas/${anio}`)
      ordenes.value = res.data

      return res.status

    } catch (error) {

      return error.status
    }
  }

  const cleanOrden = () => {
    let obj_clean_orden = {
      "id": 0,
      "numero_orden": '',
      "descripcion": '',
      "numero": '',
      "giro": '',
      "cliente": '',
    }

    Object.assign(orden.value, obj_clean_orden)
    Object.assign(obj_orden_edited.value, obj_clean_orden)
  }

  const getFechaServidor = async () => {
    try {
      const res = await api.get(`/general/fecha/hora/unix`)
      fecha_servidor.value = res.data
      return res.status

    } catch (error) {
      return error.status
    }
  }

  const getUsuarioPorNumero = async (employee_number) => {
    try {
      const res = await api.get(`/general/personal/numero/${employee_number}`)
      obj_personal.value = res.data
      return res.status

    } catch (error) {
      return error.status
    }
  }

  return {
    orden,
    obj_orden_edited,
    anio_edited,
    anios_ordenes,
    ordenes,
    fecha_servidor,
    obj_personal,
    getBuscarOrden,
    getConsultaAniosOrdenes,
    getConsultaOrdenesAnio,
    cleanOrden,
    getFechaServidor,
    getUsuarioPorNumero
  }
  
})
