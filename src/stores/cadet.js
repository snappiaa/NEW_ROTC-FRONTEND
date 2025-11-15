import { defineStore } from 'pinia'
import api from '@/utils/api.js'

export const useCadetStore = defineStore('cadet', {
  state: () => ({
    cadets: [],
    totalCadets: 0,
    totalMale: 0,
    totalFemale: 0,
    currentPage: 1,
    perPage: 10,
    totalPages: 0,
    loading: false,
  }),

  getters: {
    getCadets: (state) => state.cadets,
    getCadetById: (state) => (id) => {
      return state.cadets.find((c) => c.cadet_id === id)
    },
    stats: (state) => ({
      total: state.totalCadets,
      male: state.totalMale,
      female: state.totalFemale,
    }),
  },

  actions: {
    async fetchCadets(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/cadets', { params })
        
        // ✅ FIX: Check response.data.success, not response.success
        if (response.data.success) {
          this.cadets = response.data.data.cadets
          this.currentPage = response.data.data.pagination.current_page
          this.perPage = response.data.data.pagination.per_page
          this.totalPages = response.data.data.pagination.last_page
          return { success: true }
        }
        return { success: false }
      } catch (error) {
        console.error('Fetch cadets error:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch cadets',
        }
      } finally {
        this.loading = false
      }
    },

    async fetchCadetCount() {
      try {
        const response = await api.get('/cadets/count')
        
        // ✅ FIX: Check response.data.success
        if (response.data.success) {
          this.totalCadets = response.data.data.total
          this.totalMale = response.data.data.male
          this.totalFemale = response.data.data.female
          return { success: true }
        }
        return { success: false }
      } catch (error) {
        console.error('Fetch cadet count error:', error)
        return { success: false }
      }
    },

    async addCadet(cadetData) {
      try {
        const response = await api.post('/cadets', cadetData)
        
        // ✅ FIX: Check response.data.success (THIS IS THE MAIN FIX!)
        if (response.data.success) {
          this.cadets.unshift(response.data.data)
          this.totalCadets++
          
          if (cadetData.sex === 'Male') {
            this.totalMale++
          } else {
            this.totalFemale++
          }
          
          return { success: true, data: response.data.data }
        }
        return { 
          success: false,
          message: response.data.message || 'Failed to add cadet'
        }
      } catch (error) {
        console.error('Add cadet error:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add cadet',
          errors: error.response?.data?.errors,
        }
      }
    },

    async getCadetByCadetId(cadetId) {
      try {
        const response = await api.get(`/cadets/${cadetId}`)
        
        // ✅ FIX: Check response.data.success
        if (response.data.success) {
          return { success: true, data: response.data.data.cadet }
        }
        return { success: false }
      } catch (error) {
        console.error('Get cadet error:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Cadet not found',
        }
      }
    },
  },
})
