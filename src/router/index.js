import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

import { useSecurityStore } from 'src/stores/EvidenciasEquipos/security.js'
import { is } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Antes de cada cambio de ruta, verifica si la ruta requiere autenticación. Si la ruta requiere autenticación y no hay token, redirige al login
  Router.beforeEach(async (to, from, next) => {
    const useSecurity = useSecurityStore(); // Obtén la tienda correctamente aquí, ya que antes aún no esta cargado pinia
    const { getToken, isTokenExpired  } = useSecurity
    const token = await getToken(); // Asegúrate de manejar el token como asíncrono si es necesario
    console.log('token...', isTokenExpired());
    
    if (to.meta.requiresAuth && (!token /* || await isTokenExpired() */)) {
      next('/login'); // Redirige al login si no hay token
    } else {
      next(); // Permite el acceso
    }
  });

  return Router
})
