<script setup>
import { ref, watch } from 'vue'
import OrdenSelection from 'src/components/OrdenSelection.vue'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { storeToRefs } from 'pinia'
import DialogImagenesEquipo from 'src/components/DialogImagenesEquipo.vue'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'

const useGeneral = useGeneralStore()
const { orden } = storeToRefs(useGeneral)

const useComponentesEquipo = useComponentesEquipoStore()
const { getConsultarPiezasConEvidenciasOrden, getConsultarEvidenciasPorOrdenPieza } = useComponentesEquipo
const { listPiezasConEvidenciasOrden } = storeToRefs(useComponentesEquipo)

const visible = ref(false)
const _viewDialogImagenesEquipo = ref(false)
const _componenteSeleccionado = ref(null)
const showEvidenciasEquipo = async (componenteSelec) => {
    visible.value = true
    await getConsultarEvidenciasPorOrdenPieza(orden.value.id, componenteSelec.id).then((response) => {
        if(response.status === 200) {
            _viewDialogImagenesEquipo.value = true
            _componenteSeleccionado.value = componenteSelec
        }
    })
    visible.value = false
}
const closeDialogImagenesEquipo = () => {
    _viewDialogImagenesEquipo.value = false
}
// Vigilar cambios del objeto orden de la tienda
watch(() => orden.value.id, async (newValueId, oldValueId) => {
    if(newValueId > 0) {
        visible.value = true
        await getConsultarPiezasConEvidenciasOrden(newValueId)
        visible.value = false
    }
})

</script>

<template>
    <div class="q-mt-sm">
        <orden-selection />
    </div>
    <!-- <h6>{{ listDetalleEvidenciasOrdenAgrupadaComponente }}</h6> -->
    <div class="q-mt-sm" v-if="orden.numero_orden != ''">
        <q-list bordered>
            <div v-for="componente in listPiezasConEvidenciasOrden" :key="componente.id">
                <q-item clickable v-ripple @click="showEvidenciasEquipo(componente)">
                    <q-item-section>{{ componente.descripcion }}</q-item-section>
                    <q-item-section avatar>
                    <q-icon color="primary" name="photo_camera" />
                    </q-item-section>
                </q-item>
                <q-separator />
            </div>
        </q-list>
    </div>
    <div>
        <dialog-imagenes-equipo
            :_viewDialogImagenesEquipo = "_viewDialogImagenesEquipo"
            :_componenteSeleccionado = "_componenteSeleccionado"
            @closeDialogImagenesEquipo = "closeDialogImagenesEquipo"
        />
    </div>
    <div>
        <q-inner-loading
            :showing="visible"
            label="Porfavor espere..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
        />
    </div>
</template>