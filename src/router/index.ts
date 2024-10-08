import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/Home/HomeView.vue'
import UserLayout from '../views/user/UserLayout.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'

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
    //user
    {
      path: '/',
      component: UserLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'company/:id',
          name: 'company',
          component: () => import('../views/user/CompanyView.vue')
        },
        {
          path: 'login/:id?',
          name: 'login',
          component: () => import('../views/user/Auth/LoginView.vue')
         
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/user/Auth/RegisterView.vue')
        },
        {
          path: 'job/:id',
          name: 'job',
          component: () => import('../views/user/JobView.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/user/Home/SearchView.vue')
        },

        //customer
        {
          path: 'customer/login',
          name: 'customerLogin',
          component: () => import('../views/user/Customer/LoginView.vue')
        },
        {
          path: 'customer/register',
          name: 'customerRegister',
          component: () => import('../views/user/Customer/RegisterView.vue')
        }
      ]
    },

    //admin
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          component: () => import('../views/admin/IndexView.vue')
        },
        {
          path: 'permission',
          component: () => import('../views/admin/Permission/PermissionView.vue')
        },
        {
          path: 'role',
          component: () => import('../views/admin/Role/RoleView.vue')
        },
        {
          path: 'user',
          component: () => import('../views/admin/User/UserView.vue')
        },
        {
          path: 'company',
          component: () => import('../views/admin/Company/CompanyView.vue')
        },
        {
          path: 'resume',
          component: () => import('../views/admin/Resumes/ResumeView.vue')
        },
        {
          path: 'job',
          component: () => import('../views/admin/Jobs/JobView.vue')
        },
        {
          path: 'subscriber',
          component: () => import('../views/admin/Subscribers/SubscriberView.vue')
        },
        {
          path: 'notification',
          component: () => import('../views/admin/Notifications/NotificationView.vue')
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue')
    },

    // Error pages
    {
      path: '/403',
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
