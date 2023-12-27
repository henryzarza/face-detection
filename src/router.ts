import { createRouter, createWebHistory } from 'vue-router'
import TryOn from './views/TryOn.vue'
import NotFound from './views/NotFound.vue'
import { ROUTES } from './constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTES[0].path,
      name: ROUTES[0].name,
      component: TryOn
    },
    {
      path: ROUTES[1].path,
      name: ROUTES[1].name,
      component: () => import('./views/MusicPlayer.vue')
    },
    {
      path: ROUTES[2].path,
      name: ROUTES[2].name,
      component: () => import('./views/DoLaugh.vue')
    },
    { path: '/:pathMatch(.*)', component: NotFound }
  ]
})

export default router
