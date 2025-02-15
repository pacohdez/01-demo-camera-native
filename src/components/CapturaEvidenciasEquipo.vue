<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import OrdenSelection from '../components/OrdenSelection.vue'
import EquipoSelection from 'src/components/EquipoSelection.vue'
import TipoEvidenciaSelection from 'src/components/TipoEvidenciaSelection.vue';
import { useEvidenciaFotograficaEquipoStore } from '../stores/EvidenciasEquipos/evidenciaFotograficaEquipo.js'

const useEvidenciaFotograficaEquipo = useEvidenciaFotograficaEquipoStore()
const { imagesSource } = storeToRefs(useEvidenciaFotograficaEquipo)

const slide = ref(0)

const deletePhoto = () => {
    // Elimina la imagen del índice actual
    imagesSource.value = imagesSource.value.filter((_, index) => index !== slide.value)
  
    // Ajusta el slide si es necesario (cuando se borrá la última imagen)
    if (slide.value >= imagesSource.value.length) {
        slide.value = Math.max(0, imagesSource.value.length - 1)
    }
}
</script>

<template>
    <div class="q-mt-sm">
        <orden-selection />
    </div>

    <div class="q-mt-sm">
        <equipo-selection />
        <tipo-evidencia-selection class="q-mt-xs" />
    </div>
      
    <div class="col q-mt-xs">
        <q-carousel
            swipeable
            animated
            v-model="slide"
            arrows
            infinite
            thumbnails
            height="455px"
        >
            <q-carousel-slide
                v-for="(image, index) in imagesSource"
                :name="index" 
                :img-src="image"
                :key="index"
            />

            <template v-slot:control>
                <q-carousel-control
                v-if="imagesSource.length > 0"
                position="top-right"
                :offset="[18, 18]"
                >
                <q-btn
                    push round dense color="red"
                    icon="delete"
                    @click="deletePhoto()"
                />
                </q-carousel-control>
            </template>
        </q-carousel>
    </div>
</template>