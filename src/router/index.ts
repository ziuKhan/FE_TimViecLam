import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'activeLink',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/company/:id',
      name: 'company',
      component: () => import('../views/CompanyView.vue')
    },    
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }, 
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/job/:id',
      name: 'job',
      component: () => import('../views/JobView.vue')
    },











    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/errors/404.vue') // Catch-all route for 404
    }
  ]
})

export default router
