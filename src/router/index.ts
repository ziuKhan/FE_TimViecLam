import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'activeLink',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
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
      component: () => import('../views/Auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/RegisterView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/RegisterView.vue')
    },
    {
      path: '/job/:id',
      name: 'job',
      component: () => import('../views/JobView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Home/SearchView.vue')
    },

    //customer
    {
      path: '/customer/login',
      name: 'customerLogin',
      component: () => import('../views/Customer/LoginView.vue')
    },
    {
      path: '/customer/register',
      name: 'customerRegister',
      component: () => import('../views/Customer/RegisterView.vue')
    },

    // Error pages
    {
      path: '/401',
      name: 'Unauthorized',
      component: () => import('../errors/403.vue')
    },
    {
      path: '/500',
      name: 'ServerError',
      component: () => import('../errors/500.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/errors/404.vue')
    }
  ]
})

export default router
