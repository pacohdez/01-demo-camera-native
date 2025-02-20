<script setup>
import { ref } from 'vue'
import { useSecurityStore } from 'src/stores/EvidenciasEquipos/security.js'
import { useRouter } from 'vue-router'
import { useGetNotify } from 'src/composables/getNotify.js'

const useSecurity = useSecurityStore()
const { postLogin } = useSecurity

const useNotify = useGetNotify()
const { notify } = useNotify

const router = useRouter(); // Hook para acceder al router

const username = ref('')
const password = ref('')

const login = async() => {
    await postLogin(username.value, password.value).then(async(response) => {
        if(response.status === 200) {
            console.log('Login exitoso');
            await router.push('/').then(() => {
                console.log('Redirección completada.');
            }).catch((err) => {
                console.error('Error al redirigir:', err);
            });
        } else if(response.status === 0) {
            router.push('/access-denied')
        } else {
            notify('¡Usuario y/ó contraseña incorrecta!', 'negative', 'center', 'error')
        }
    })
}

</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <!-- Contenedor de páginas -->
        <q-page-container>
            <!-- Página principal -->
            <q-page class="flex flex-center q-pa-md custom-page">
                <q-card class="q-pa-md shadow-2" style="max-width: 350px;">
                    <!-- Logo o Avatar -->
                    <q-card-section class="text-center">
                        <!-- <q-avatar size="80px" class="bg-primary text-white q-mb-md">
                            <q-icon name="login" size="40px" />
                        </q-avatar> -->
                        <q-img src="/logo3.png" />
                        <br /><br />
                        <div class="text-h7 text-black"><strong>Inicia Sesión</strong></div>
                        <div class="text-subtitle2"></div>
                    </q-card-section>

                    <!-- Formulario de login -->
                    <q-card-section>
                        <q-form @submit.prevent="login">
                            <q-input 
                                v-model="username"
                                label="Usuario" 
                                outlined 
                                dense 
                                :rules="[val => !!val || 'Usuario requerido']"
                                class="q-mb-md" 
                                clearable 
                                prepend="person" 
                            />
                            <q-input 
                                v-model="password"
                                label="Contraseña" 
                                type="password" 
                                outlined 
                                dense
                                :rules="[val => !!val || 'Contraseña requerida']" 
                                clearable 
                                prepend="lock" 
                            />
                            <q-btn 
                                type="submit" 
                                label="Iniciar sesión"
                                style="background-color: #3B3F51;"
                                unelevated
                                class="full-width q-mt-lg" 
                            />
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<style>
/* Estilo personalizado para el fondo del q-page */
.custom-page {
  background: linear-gradient(
      rgba(0, 0, 0, 0.6), 
      rgba(0, 0, 0, 0.6)
    ), 
    url('src/assets/rotor1.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #ffffff; /* Asegura que el texto sea legible */
}

.q-card {
  background: #ffffff;
  border-radius: 12px;
}

.q-btn.full-width {
  width: 100%;
}
</style>