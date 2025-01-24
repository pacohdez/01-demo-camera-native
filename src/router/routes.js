const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayoutEq.vue'),
    meta: { requiresAuth: true }, // Solo accesible si está autenticado
  },
  {
    path: '/login',
    component: () => import('src/layouts/MainLayoutSignIn.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
