import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/Home/HomeView.vue'
import UserLayout from '../views/user/UserLayout.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import accountService from '../services/account.service'
import checkAccountSetup from '../middleware/checkAccountSetup'
import checkAdminAccess from '../middleware/checkAdminAccess'
import checkLoginRedirect from '../middleware/checkLoginRedirect'

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
          path: 'account-setup',
          beforeEnter: checkAdminAccess,
          name: 'accountSetup',
          component: () => import('../views/user/Auth/AccountSetupView.vue')
        },
        {
          path: 'account-setup-pass',
          name: 'accountSetupPass',
          component: () => import('../views/user/Auth/AccountSetupPassView.vue')
        },
        {
          path: 'login/:id?',
          name: 'login',
          component: () => import('../views/user/Auth/LoginView.vue'),
          beforeEnter: checkLoginRedirect
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
          path: 'customer',
          name: 'customerRegister',
          component: () => import('../views/user/Customer/RegisterView.vue')
        },
        {
          path: 'sub-package',
          name: 'subPackage',
          component: () => import('../views/user/SubPackageView.vue')
        },
        {
          path: 'success',
          name: 'success',
          component: () => import('../views/user/SuccessView.vue')
        },
        {
          path: 'cancel',
          name: 'cancel',
          component: () => import('../views/user/CancelView.vue')
        }
      ]
    },

    //admin
    {
      path: '/admin',
      component: AdminLayout,
      beforeEnter: checkAdminAccess,
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
          path: 'skill',
          component: () => import('../views/admin/Skills/SkillView.vue')
        },
        {
          path: 'customer-approval',
          component: () => import('../views/admin/CustomerApproval/CustomerApprovalView.vue')
        },
        {
          path: 'role',
          component: () => import('../views/admin/Role/RoleView.vue')
        },
        {
          path: 'user',
          component: () => import('../views/admin/User.vue')
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
        },
        {
          path: 'personal_information',
          component: () => import('../views/admin/PersonalInformation/PersonalInformationView.vue')
        },
        {
          path: 'subscription_package',
          component: () => import('../views/admin/SubscriptionPackage/SubscriptionPakageView.vue')
        }
      ]
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

// Áp dụng middleware checkAccountSetup cho tất cả các route
router.beforeEach(checkAccountSetup)

export default router
