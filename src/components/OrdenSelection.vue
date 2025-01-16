<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { useGetNotify } from '../composables/getNotify.js'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'
import { useEvidenciaFotograficaEquipoStore } from '../stores/EvidenciasEquipos/evidenciaFotograficaEquipo.js'
import DialogOrdenSelection from './DialogOrdenSelection.vue';

const useGeneral = useGeneralStore()
const { getBuscarOrden } = useGeneral
const { orden, obj_orden_edited } = storeToRefs(useGeneral)

const useComponentesEquipo = useComponentesEquipoStore()
const { cleanComponenteSeleccionado } = useComponentesEquipo

const useEvidenciaFotograficaEquipo = useEvidenciaFotograficaEquipoStore()
const { cleanImagesSource } = useEvidenciaFotograficaEquipo

const useNotify = useGetNotify()
const { notify } = useNotify

const _viewDialogOrden = ref(false)

const getOrden = async () => {
    await getBuscarOrden(obj_orden_edited.value.numero_orden).then((status) => {
        if(status != 200) {
            cleanComponenteSeleccionado()
            cleanImagesSource()
            notify('¡No se encontró la orden!', 'negative', 'center', 'error')
        }
    })
}
const viewDialogOrden = () => {
    _viewDialogOrden.value = true
}
const closeDialogOrdenes = () => {
    _viewDialogOrden.value = false
}
const ordenTableSeleccionado = (orden) => {
    obj_orden_edited.value.numero_orden = orden.numero_orden
    getOrden()
}
</script>

<template>
    <div class="row">
        <div class="col-3">
            <q-input 
                type="text" 
                filled 
                label="No. orden" 
                dense
                v-model="obj_orden_edited.numero_orden"
                @change="getOrden()"
            />
        </div>
        <q-btn flat round color="primary" icon="search" @click="viewDialogOrden()" />
        <div class="col">
            <q-input 
                type="text" 
                filled 
                label="Descripción orden" 
                readonly 
                dense
                v-model="obj_orden_edited.descripcion" 
            />
        </div>
    </div>
    <div class="row q-mt-sm">
        <div class="col-2">
            <q-input 
                type="number" 
                filled 
                label="No. giro" 
                dense
                readonly
                v-model="obj_orden_edited.giro"
            />
        </div>
        <div class="col-2 q-pl-xs">
            <q-input 
                type="number" 
                filled 
                label="No. cte" 
                dense
                readonly
                v-model="obj_orden_edited.numero"
            />
        </div>
        <div class="col q-pl-xs">
            <q-input 
                type="text" 
                filled 
                label="Cliente" 
                readonly 
                dense
                v-model="obj_orden_edited.cliente"
            />
        </div>
    </div>
    <div>
        <dialog-orden-selection
            :_viewDialogOrden = "_viewDialogOrden"
            @ordenTableSeleccionado = "ordenTableSeleccionado"
            @closeDialogOrdenes = "closeDialogOrdenes"
        />
    </div>
</template>