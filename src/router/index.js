import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthView.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/components/auth/LoginForm.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/components/auth/RegistrationForm.vue')
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/components/auth/ForgotPassword.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/components/pages/HomePage.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/components/pages/ProfilePage.vue')
      },
      {
        path: 'qr',
        name: 'QRScan',
        component: () => import('@/components/pages/QRAttendancePage.vue')
      },
      {
        path: 'cadets',
        name: 'Cadets',
        component: () => import('@/components/pages/ManageCadetPage.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/components/pages/ReportsPage.vue')
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/components/pages/HistoryPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')
  
  // Check if token exists and initialize auth store
  if (token && !authStore.isAuthenticated) {
    try {
      await authStore.checkAuth()  // Initialize auth state if needed
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem('token')
    }
  }
  
  // Route requires auth but user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } 
  // User is authenticated and trying to access auth pages
  else if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next('/dashboard/home')
  } 
  // All other cases
  else {
    next()
  }
})


export default router
