<script setup>
import { ref, defineProps, computed, onMounted } from 'vue'

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

onMounted(() => {

})

</script>

<template>
    <q-dialog
        v-model="localDialog"
    >
        <q-card>
            <q-card-section class="text-white" style="background-color: #3B3F51;">
                <div class="text-h6">Evidencias del equipo: {{ _componenteSeleccionado.nombre }}</div>
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
                    >
                        <q-carousel-slide
                            v-for="(image, index) in _componenteSeleccionado.imagenes"
                            :name="index" 
                            :img-src="image"
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
