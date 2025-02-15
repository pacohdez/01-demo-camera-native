<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import { useCatalogoTiposEvidenciasStore } from 'src/boot/EvidenciasEquipos/catalogoTiposEvidenciasEquipos.js'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'

const useCatalogoTiposEvidencias = useCatalogoTiposEvidenciasStore()
const { tipos_evidencias, tipo_seleccionado } = storeToRefs(useCatalogoTiposEvidencias)

const useGeneral = useGeneralStore()
const { orden } = storeToRefs(useGeneral)

</script>

<template>
    <div class="row">
        <q-select
            label="Selecciona el tipo de evidencia"
            filled
            v-model="tipo_seleccionado"
            use-input
            use-chips
            input-debounce="0"
            :options="tipos_evidencias"
            class="col-12"
            dense
            :disable="orden.numero_orden === ''"
            :option-label="item => item.clave + ' - ' + item.descripcion"
        />
    </div>
</template>