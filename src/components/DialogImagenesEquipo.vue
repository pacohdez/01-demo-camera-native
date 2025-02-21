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
const nombre_imagen = ref("")
const onSlideChange = (newSlide) => {
    /* slide.value = newSlide;
    loadImage(newSlide); // Cargar la imagen actual
    loadImage(newSlide + 1); // Precargar la siguiente imagen 
    console.log(newSlide); */
    nombre_imagen.value = listEvidenciasPorOrdenPieza.value[newSlide].documento.nombre_archivo
}
watch(() => props._viewDialogImagenesEquipo, async (newValue, oldValue) => {
    if(newValue) {
        slide.value = 0
        nombre_imagen.value = listEvidenciasPorOrdenPieza.value[slide.value].documento.nombre_archivo
    }
})
</script>

<template>
    <q-dialog
        v-model="localDialog"
    >
        <q-card>
            <q-card-section class="text-white" style="background-color: #3B3F51;">
                <div class="text-h6">Componente: {{ _componenteSeleccionado.descripcion }}.</div>
                <div class="text-h7">{{ nombre_imagen }}</div>
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
                        @transition="onSlideChange"
                    ><!-- @transition="onSlideChange" -->
                        <q-carousel-slide
                            v-for="(image, index) in listEvidenciasPorOrdenPieza"
                            :name="index" 
                            :img-src="'data:' + image.documento.tipo_contenido + ';base64,' + image.documento.base64"
                            :key="index"
                        >
                            <template v-if="!image.documento.base64">
                                <div class="no-image-placeholder">
                                    <p>¡No hay imagen disponible, la imagen ya fue clasificada!</p>
                                </div>
                            </template>
                        </q-carousel-slide>
                    </q-carousel>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-primary">
                <q-btn flat label="Cerrar" @click="emit('closeDialogImagenesEquipo')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<style>
.no-image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #f0f0f0; /* Fondo gris claro para el placeholder */
  color: #666; /* Color del texto */
  font-size: 1.2em;
}
</style>