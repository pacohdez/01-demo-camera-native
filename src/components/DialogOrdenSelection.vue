<script setup>
import { storeToRefs } from 'pinia';
import { ref, defineProps, computed, onMounted } from 'vue'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'

const useGeneral = useGeneralStore()
const { getConsultaOrdenes } = useGeneral
const { ordenes } = storeToRefs(useGeneral)

const props = defineProps({
    _viewDialogOrden: Boolean,
})
const emit = defineEmits([
    'closeDialogOrdenes',
    'ordenTableSeleccionado',
])

const localDialog = computed({
    get() {
        return props._viewDialogOrden;
    },
    set(value) {
        if (!value) {
            emit('closeDialogOrdenes');
        }
    }
})

onMounted(() => {
    getConsultaOrdenes()
})

const columns = [
    { name: 'actions', label: '', align: 'center', field: 'actions', sortable: false },
    { name: 'numero_orden', label: 'ORDEN', align: 'center', field: 'numero_orden', sortable: true },
    { name: 'descripcion', label: 'DESCRIPCIÓN', align: 'center', field: 'descripcion', sortable: true }
]

const separator =  'horizontal'
const pagination = {
    rowsPerPage: 50
}
const filter = ref(null)

const ordenSeleccionada = (orden) => {
    emit('ordenTableSeleccionado', orden)
    emit('closeDialogOrdenes')
}

</script>

<template>
    <q-dialog
        v-model="localDialog"
    >
        <q-card style="width: 900px; max-width: 80vw;">
            <q-card-section class="text-white" style="background-color: #3B3F51;">
                <div class="text-h6">Catálogo ordenes</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="row">
                    <q-table 
                        class="col-12 my-sticky-header-table"
                        :rows="ordenes"
                        :columns="columns"
                        color="primary"
                        flat
                        bordered
                        :filter="filter"
                        :separator="separator"
                        :pagination="pagination"
                        :loading="ordenes.length <= 0"
                        dense
                    >
                        <template v-slot:top-right>
                            <q-input  dense debounce="300" v-model="filter" placeholder="Buscar">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props" style="width: 100px;">
                                <q-btn
                                    rounded
                                    size="sm"
                                    color="primary"
                                    label="Seleccionar"
                                    @click="ordenSeleccionada(props.row)"
                                />
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-primary">
                <q-btn flat label="Cerrar" @click="emit('closeDialogOrdenes')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
