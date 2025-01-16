<script setup>
import { ref } from 'vue'
import OrdenSelection from 'src/components/OrdenSelection.vue'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { storeToRefs } from 'pinia'
import DialogImagenesEquipo from 'src/components/DialogImagenesEquipo.vue'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'

const useGeneral = useGeneralStore()
const { orden } = storeToRefs(useGeneral)

const useComponentesEquipo = useComponentesEquipoStore()
const { listComponentes } = storeToRefs(useComponentesEquipo)

const _viewDialogImagenesEquipo = ref(false)
const _componenteSeleccionado = ref(null)
const showEvidenciasEquipo = (componenteSelec) => {
    console.log('Mostrar evidencias del equipo')
    _viewDialogImagenesEquipo.value = true
    _componenteSeleccionado.value = componenteSelec
}
const closeDialogImagenesEquipo = () => {
    _viewDialogImagenesEquipo.value = false
}
</script>

<template>
    <div class="q-mt-sm">
        <orden-selection />
    </div>
    <div class="q-mt-sm" v-if="orden.numero_orden != ''">
        <q-list bordered>
            <div v-for="componente in listComponentes" :key="componente.id">
                <q-item clickable v-ripple @click="showEvidenciasEquipo(componente)">
                    <q-item-section>{{ componente.nombre }}</q-item-section>
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
</template>