<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();
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
                        <q-img class="imagen" src="/accesoDenegado.png" />
                        <br /><br />
                        <div class="text-h6 text-black"><strong>¡No tienes permisos para acceder a esta página!</strong></div>
                        <div class="text-subtitle2"></div>
                    </q-card-section>

                    <q-card-section class="text-center">
                        <q-btn label="Regresar Login" style="background-color: #3B3F51;" @click="router.push('/')" />
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

  .imagen {
    border-radius: 12px;
  }
</style>