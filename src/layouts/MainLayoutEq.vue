<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { useEvidenciaFotograficaEquipoStore } from '../stores/EvidenciasEquipos/evidenciaFotograficaEquipo.js'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'
import { useSecurityStore } from 'src/stores/EvidenciasEquipos/security.js'
import { useRouter } from 'vue-router'
import CapturaEvidenciasEquipo from 'src/components/CapturaEvidenciasEquipo.vue'
import ConsultaEvidenciasEquipo from 'src/components/ConsultaEvidenciasEquipo.vue'
import Swal from 'sweetalert2'

const useGeneral = useGeneralStore()
const { cleanOrden } = useGeneral
const { orden } = storeToRefs(useGeneral)

const useEvidenciaFotograficaEquipo = useEvidenciaFotograficaEquipoStore()
const { cleanImagesSource } = useEvidenciaFotograficaEquipo
const { imagesSource } = storeToRefs(useEvidenciaFotograficaEquipo)

const useComponentesEquipo = useComponentesEquipoStore()
const { cleanComponenteSeleccionado, addListadoComponente } = useComponentesEquipo
const { componenteSeleccionado } = storeToRefs(useComponentesEquipo)

const useSecurity = useSecurityStore();
const { clearToken, isTokenExpired } = useSecurity
const router = useRouter()

const checkSession = async () => {
  console.log('Verificando sesión...');
  console.log('Token expirado:', await isTokenExpired());
  
  if (await isTokenExpired()) {
    console.log('Token expirado. Redirigiendo al login...');
    clearToken(); // Limpia cualquier dato almacenado del usuario
    router.push('/login'); // Redirige al login
  }
}

onMounted(() => {
  // Verifica la sesión cada 60 segundos
  const interval = setInterval(checkSession, 60000);

  // Limpia el intervalo cuando se desmonta el componente
  onUnmounted(() => clearInterval(interval));
})

async function takePicture() {
  // Verificar plataforma
  if (!Capacitor.isNativePlatform()) {
    alert('Solo funciona en dispositivos móviles')
    return
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    })
    imagesSource.value.push(image.webPath)
  } catch (error) {
    console.error('Error al tomar foto:', error)
  }
}

const tab = ref('Captura')
const guardar = async () => {
  Swal.fire({
    
    title: `¿Seguro de guardar las evidencias del equipo: ${componenteSeleccionado.value}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar"
  }).then(async result => {
    if (result.value) {
      Swal.fire("Información guardada exitosamente!", "", "success").then(() => {
        let obj_listado = {
          id: orden.value.id,
          numero_orden: orden.value.numero_orden,
          componente: componenteSeleccionado.value,
          imagenes: imagesSource.value
        }
        console.log(JSON.stringify(obj_listado))
        addListadoComponente(obj_listado)
        cleanOrden()
        cleanComponenteSeleccionado()
        cleanImagesSource()
      })
    }
  });
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated style="background-color: #3B3F51;">
      <q-toolbar>
        <q-toolbar-title>
          Evidencias Equipos
        </q-toolbar-title>
        <q-tabs v-model="tab" shrink stretch>
          <q-tab name="Captura" icon="add_circle" @click="cleanOrden(); " />
          <q-tab name="Consulta" icon="search" @click="cleanOrden(); " />
        </q-tabs>
        <q-btn
          flat
          round
          color="white"
          icon="logout"
          @click="clearToken(); router.push('/login')"
          class="absolute"
          style="right: 0; top: 0; transform: translateY(50%);"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Captura" class="q-pa-none">
          <captura-evidencias-equipo />
        </q-tab-panel>
        <q-tab-panel name="Consulta" class="q-pa-none">
          <consulta-evidencias-equipo />
        </q-tab-panel>
      </q-tab-panels>
    </q-page-container>

    <q-footer elevated class="bg-grey-7 text-white" v-if="tab === 'Captura'">
      <q-toolbar class="flex-center">
        <q-btn 
          round 
          color="standard" 
          icon="add_a_photo"
          size="lg"
          :disable="orden.numero_orden === ''"
          @click="takePicture()"
        />
        <q-btn 
          v-if="orden.numero_orden != '' && imagesSource.length > 0 && componenteSeleccionado != null"
          round 
          color="secondary" 
          icon="save"
          class="absolute"
          size="lg"
          style="top: 0; right: 25px; transform: translateY(-50%); z-index: 1; "
          @click="guardar()"
        />
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>