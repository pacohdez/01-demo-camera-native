<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { useGetNotify } from '../composables/getNotify.js'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'

const useGeneral = useGeneralStore()
const { orden } = storeToRefs(useGeneral)

const useComponentesEquipo = useComponentesEquipoStore()
const { componenteSeleccionado } = storeToRefs(useComponentesEquipo)

const useNotify = useGetNotify()
const { notify } = useNotify

const stringOptions = [
    'ROTOR', 
    'CHUMACERA LADO COPLE', 
    'CHUMACERA LADO GOBERNADOR', 
    'CHUMACERA LADO AXIAL', 
    'SELLOS DE CARBÓN',
    'SELLOS DE ACEITE',
    'TOBERA',
    'DIAFRAGMA',
    'CUERPO DE VÁLVULAS',
    'VÁLVULA DE DISPARO',
    'VÁLVULA DE GOBERNADOR',
    'RÓTULAS',
    'TAPA DE DISCOS'
]
const filterOptions = ref(stringOptions)
const createValue = (val, done) => {
    val = val.toUpperCase();
    if (val.length > 0) {
        if (!stringOptions.includes(val)) {
            stringOptions.push(val)
        }
        done(val, 'toggle')
        notify('¡Se adiciono el nuevo equipo!', 'positive', 'center', 'check_circle')
    }
}
const filterFn = (val, update) => {
    update(() => {
        if (val === '') {
            filterOptions.value = stringOptions
        } else {
            const needle = val.toLowerCase()
            filterOptions.value = stringOptions.filter(
                v => v.toLowerCase().indexOf(needle) > -1
            )
        }
    })
}
</script>

<template>
    <div class="row">
        <q-select
            label="Selecciona la parte del equipo"
            filled
            v-model="componenteSeleccionado"
            use-input
            use-chips
            input-debounce="0"
            @new-value="createValue"
            :options="filterOptions"
            @filter="filterFn"
            class="col-12"
            dense
            :disable="orden.numero_orden === ''"
            @change="componenteSeleccionado = componenteSeleccionado.toUpperCase()"
        />
    </div>
</template>