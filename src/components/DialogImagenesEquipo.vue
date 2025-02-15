<script setup>
import { ref, defineProps, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'

const useComponentesEquipo = useComponentesEquipoStore()
const { listEvidenciasPorOrdenPieza } = storeToRefs(useComponentesEquipo)

const props = defineProps({
    _viewDialogImagenesEquipo: Boolean,
    _componenteSeleccionado: Object,
})
const emit = defineEmits([
    'closeDialogImagenesEquipo',
])

const localDialog = computed({
    get() {
        return props._viewDialogImagenesEquipo;
    },
    set(value) {
        if (!value) {
            emit('closeDialogImagenesEquipo');
        }
    }
})
const slide = ref(0)
/* const onSlideChange = (newSlide) => {
    slide.value = newSlide;
    loadImage(newSlide); // Cargar la imagen actual
    loadImage(newSlide + 1); // Precargar la siguiente imagen
    console.log(newSlide);
} */
watch(() => props._viewDialogImagenesEquipo, async (newValue, oldValue) => {
    if(newValue) {
        slide.value = 0
    }
})
</script>

<template>
    <q-dialog
        v-model="localDialog"
    >
        <q-card>
            <q-card-section class="text-white" style="background-color: #3B3F51;">
                <div class="text-h6">Evidencias del equipo: {{ _componenteSeleccionado.descripcion }}</div>
            </q-card-section>

            <q-card-section class="q-pa-none">
                <div class="col">
                    <q-carousel
                        swipeable
                        animated
                        v-model="slide"
                        arrows
                        infinite
                        thumbnails
                    ><!-- @transition="onSlideChange" -->
                        <q-carousel-slide
                            v-for="(image, index) in listEvidenciasPorOrdenPieza"
                            :name="index" 
                            :img-src="'data:'+image.documento.tipo_contenido+';base64,'+image.documento.base64"
                            :key="index"
                        />
                    </q-carousel>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-primary">
                <q-btn flat label="Cerrar" @click="emit('closeDialogImagenesEquipo')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
