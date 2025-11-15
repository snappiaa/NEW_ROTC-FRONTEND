import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    // ✅ FIX: Set isAuthenticated based on token existence
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    userName: (state) => state.user?.name || 'Guest',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    // Initialize auth on app load
    async initializeAuth() {
      if (this.token) {
        this.isAuthenticated = true
        // Fetch user data but don't logout on error
        try {
          await this.fetchUser()
        } catch (error) {
          console.error('Could not fetch user data:', error)
          // Don't logout here - token might still be valid
        }
      }
    },

    // Fetch current user data
    async fetchUser() {
      try {
        const response = await api.get('/me')
        if (response.data.success) {
          this.user = response.data.data.user
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('Fetch user error:', error)
        // Only logout if it's a 401 (unauthorized)
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error  // Re-throw for initializeAuth to catch
      }
    },

    // Token-based login
    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)
        
        if (response.data.success) {
          this.user = response.data.data.user
          this.token = response.data.data.token
          this.isAuthenticated = true
          localStorage.setItem('token', this.token)
          return { success: true }
        }
        
        return { 
          success: false, 
          message: response.data.message || 'Login failed' 
        }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Network error. Please check your connection.'
        }
      }
    },

    // Register
    async register(formData) {
      try {
        const response = await api.post('/register', formData)
        
        if (response.data.success) {
          return { success: true, data: response.data.data }
        }
        
        return {
          success: false,
          message: response.data.message || 'Registration failed'
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Registration failed',
          errors: error.response?.data?.errors
        }
      }
    },

    // Logout
    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
      }
    }
  }
})
