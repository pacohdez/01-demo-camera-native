<script setup>
import { storeToRefs } from 'pinia';
import { ref, nextTick } from 'vue'
import { useGetNotify } from '../composables/getNotify.js'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'
import { useSecurityStore } from 'src/stores/EvidenciasEquipos/security.js'

const useGeneral = useGeneralStore()
const { orden } = storeToRefs(useGeneral)

const useComponentesEquipo = useComponentesEquipoStore()
const { postGuardarPiezaNueva, postForzarGuardarPiezaNueva, asignarComponente } = useComponentesEquipo
const { componenteSeleccionado, catalogoPiezas, listPiezasSimilares } = storeToRefs(useComponentesEquipo)

const useSecurity = useSecurityStore()
const { obj_session_user } = storeToRefs(useSecurity)

const useNotify = useGetNotify()
const { notify } = useNotify

const mySelect = ref(null)
const dialogPiezasSimilares = ref(false)
const obj_pieza_nueva = ref({})
const filterOptions = ref(catalogoPiezas.value)
const createValue = async (val, done) => {
    val = val.toUpperCase();
    let existeValEnArray = catalogoPiezas.value.some(catalogoPieza => catalogoPieza.descripcion === val)
    if (val.length > 0) {
        if (!existeValEnArray) {
            
            obj_pieza_nueva.value.descripcion = val
            obj_pieza_nueva.value.creado_por = obj_session_user.value.employee_number
            
            await postGuardarPiezaNueva(obj_pieza_nueva.value).then((result) => {
                if(result.status != 201) {
                    dialogPiezasSimilares.value = true
                } else {
                    notify(`¡Se adicionó el equipo correctamente!`, 'positive', 'center', 'check_circle')
                }
                    
                
            })
        }
        done(componenteSeleccionado.value, 'toggle')
    }
}
const filterFn = (val, update) => {
    update(() => {
        if (val === '') {
            filterOptions.value = catalogoPiezas.value
        } else {
            const needle = val.toLowerCase()
            filterOptions.value = catalogoPiezas.value.filter(
                v => v.descripcion.toLowerCase().indexOf(needle) > -1
            )
        }
    })
}
const forzarGuardado = async (done) => {
    await postForzarGuardarPiezaNueva(obj_pieza_nueva.value).then((result) => {
        if(result.status === 201) {
            notify(`¡Se adicionó el equipo correctamente!`, 'positive', 'center', 'check_circle')
            closeOptionsSelect()
        } else {
            notify('¡Error, no se pudo adicionar el nuevo equipo!', 'negative', 'center', 'cancel')
        }
    })
}
const closeOptionsSelect = () => {
    if (mySelect.value) {
        mySelect.value.hidePopup(); // Método nativo de Quasar para cerrar el menú desplegable
    }
}
</script>

<template>
    <div class="row">
        <q-select
            ref="mySelect"
            label="Selecciona la parte del equipo"
            filled
            v-model="componenteSeleccionado"
            use-input
            use-chips
            input-debounce="0"
            @new-value="createValue"
            :options="filterOptions"
            :option-label="item => item.descripcion"
            @filter="filterFn"
            class="col-12"
            dense
            :disable="orden.numero_orden === ''"
            @update:model-value="componenteSeleccionado = componenteSeleccionado.toUpperCase()"
        />

        <!-- Dialog para mostrar piezas similares en existencia -->
        <q-dialog v-model="dialogPiezasSimilares" persistent>
            <q-card>
                <q-card-section class="text-white" style="background-color: #3B3F51;">
                    <div class="text-h6">¡Existen equipos similares a: <strong>{{ obj_pieza_nueva.descripcion }}</strong>!</div>
                </q-card-section>
                <q-card-section>
                    <div class="text-h7">NOTA: Vuelve a revisar la lista ó selecciona de la siguiente el equipo correcto, si no agregaló.</div>
                </q-card-section>
                <q-card-section class="row items-center">
                    <q-list dense separator class="col">
                        <q-item v-for="pieza in listPiezasSimilares" :key="pieza.id">
                            <q-item-section avatar>
                                <q-btn round color="primary" icon="check" size="sm" @click="asignarComponente(pieza); dialogPiezasSimilares = false;" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ pieza.descripcion }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn flat label="Agregar nuevo" color="primary" @click="forzarGuardado(); dialogPiezasSimilares = false; " />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- ------------------------------------------------- -->
    </div>
</template>