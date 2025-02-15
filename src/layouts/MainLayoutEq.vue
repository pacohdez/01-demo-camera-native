<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { useGeneralStore } from '../boot/EvidenciasEquipos/general.js'
import { useEvidenciaFotograficaEquipoStore } from '../stores/EvidenciasEquipos/evidenciaFotograficaEquipo.js'
import { useComponentesEquipoStore } from '../stores/EvidenciasEquipos/componentesEquipo.js'
import { useCatalogoTiposEvidenciasStore } from 'src/boot/EvidenciasEquipos/catalogoTiposEvidenciasEquipos.js'
import { useSecurityStore } from 'src/stores/EvidenciasEquipos/security.js'
import { useGetConvertDataUrlToFile } from 'src/composables/getConvertToFile.js'
import { useGetConvertUriToBase64 } from 'src/composables/getConvertUriToBase64.js'
import { useEvidenciasComponentesStore } from 'src/boot/EvidenciasEquipos/evidenciasComponentes.js'
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
const { cleanComponenteSeleccionado, addListadoComponente, getCatalogoPiezas } = useComponentesEquipo
const { componenteSeleccionado } = storeToRefs(useComponentesEquipo)

const useCatalogoTiposEvidencias = useCatalogoTiposEvidenciasStore()
const { getCatalogoTiposEvidencias, cleanTiposEvidencias } = useCatalogoTiposEvidencias
const { tipo_seleccionado } = storeToRefs(useCatalogoTiposEvidencias)

const useSecurity = useSecurityStore();
const { clearToken, isTokenExpired, refreshAccessToken } = useSecurity
const { obj_session_user } = storeToRefs(useSecurity)

const useEvidenciasComponentes = useEvidenciasComponentesStore()
const { postEvidenciasComponentes } = useEvidenciasComponentes

const useConvertDataUrlToFile = useGetConvertDataUrlToFile()
const { dataUrlToFile } = useConvertDataUrlToFile

const useConvertUriToBase64 = useGetConvertUriToBase64()
const { uriToBase64 } = useConvertUriToBase64

const router = useRouter()

const isMounted = ref(false)
const obj_evidencias_save = ref({})
const disableBtnGuardar = ref(false)

const checkSession = async () => {
  if(isMounted.value) {
    if (await isTokenExpired()) {
      clearToken(); // Limpia cualquier dato almacenado del usuario
      router.push('/login'); // Redirige al login
    }
  }
}

const handleMouseMove = () => {
  refreshAccessToken().then((status) => {
    /* if (status != 200)
      console.log('Error al refrescar token');
    console.log('Token refrescado correctamente'); */
  });
};

const handleKeyDown = () => {
  refreshAccessToken().then((status) => {
    /* if (status != 200)
      console.log('Error al refrescar token');
    console.log('Token refrescado correctamente'); */
  });
};

const handleScroll = () => {
  refreshAccessToken().then((status) => {
    /* if (status != 200)
      console.log('Error al refrescar token');
    console.log('Token refrescado correctamente'); */
  });
};

const handleClick = () => {
  refreshAccessToken().then((status) => {
    /* if (status != 200)
      console.log('Error al refrescar token');
    console.log('Token refrescado correctamente'); */
  });
};

const listenersActivity = () => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('click', handleClick);
}

const stopListenersActivity = () => {
  // Eliminar listeners al desmontar el componente
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', handleClick);
  //console.log('Eventos eliminados correctamente');
}

onMounted(() => {
  isMounted.value = true
  getCatalogoTiposEvidencias()
  getCatalogoPiezas()
  // Verifica la sesión cada 1 segundo
  setInterval(checkSession, 1000);
  listenersActivity(); // Inicia el monitoreo de actividad del usuario
})

onUnmounted(() => {
  isMounted.value = false
  stopListenersActivity();
})

const cleanPantalla = () => {
  cleanOrden()
  cleanComponenteSeleccionado()
  cleanImagesSource()
  cleanTiposEvidencias()
}

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
    title: `¿Seguro de guardar las evidencias del equipo: ${componenteSeleccionado.value.descripcion}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar"
  }).then(async result => {
    if (result.value) {
      disableBtnGuardar.value = true
      var formData = new FormData();
      var json_archivos = [];

      for(let i=0; i < imagesSource.value.length; i++) {
        obj_evidencias_save.value = {}
        let obj_documento = {}

        let base64 = await uriToBase64(imagesSource.value[i])
        let archivo = dataUrlToFile(base64, 'jpeg')
        //obj_evidencias_save.value.tipo_contenido = archivo.type
        obj_evidencias_save.value.origen_evidencias_componentes_catalogo_piezas_id = componenteSeleccionado.value.id
        obj_evidencias_save.value.origen_personal_id = obj_session_user.value.id
        obj_documento.origen_id = orden.value.id
        obj_evidencias_save.value.documento = obj_documento;

        formData.append('uploadfile', archivo)
        json_archivos.push(obj_evidencias_save.value)
      }
                            
      var json = (JSON.stringify(json_archivos))
      formData.append("archivos", json)
      formData.append("noOrden", orden.value.numero_orden)
      formData.append("tipo_evidencia_id", tipo_seleccionado.value.id)
      formData.append("tipo_evidencia", tipo_seleccionado.value.clave)
      formData.append("pieza", componenteSeleccionado.value.descripcion)
      formData.append("noEmpleado", obj_session_user.value.employee_number)

      await postEvidenciasComponentes(formData).then((status) => {
        if(status === 201) {
          Swal.fire("Información guardada exitosamente!", "", "success").then(() => {
            disableBtnGuardar.value = false
            cleanPantalla()
          })
        } else {
          Swal.fire("Error al guardar la información!", "", "error")
          disableBtnGuardar.value = false
        }
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

        <q-btn-dropdown 
          class="q-pa-none"
          color="white" 
          size="sm" 
          :label="obj_session_user.employee_number + ' - ' + obj_session_user.name" 
          dropdown-icon="keyboard_arrow_down" 
          flat
        >
          <q-list>
            <q-item clickable v-close-popup @click="clearToken(); router.push('/login')">
              <q-item-section>
                <q-item-label>Cerrar sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>

      <q-tabs v-model="tab" shrink stretch dense class="text-blue-grey-7" inline-label>
        <q-tab name="Captura" label="Captura" icon="add_circle" @click="cleanPantalla(); " />
        <q-tab name="Consulta" label="Cosultar" icon="search" @click="cleanPantalla(); " />
      </q-tabs>

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
          v-if="orden.numero_orden != '' && imagesSource.length > 0 && componenteSeleccionado != null && tipo_seleccionado != null"
          round 
          color="secondary" 
          icon="save"
          class="absolute"
          size="lg"
          style="top: 0; right: 25px; transform: translateY(-50%); z-index: 1; "
          :disable="disableBtnGuardar"
          @click="guardar()"
        />
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>