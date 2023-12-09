import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/try-on',
      name: 'try-on',
      component: () => import('../views/TryOn.vue')
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('../views/MusicView.vue')
    }
  ]
})

export default router
