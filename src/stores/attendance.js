import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    todayAttendance: null,
    attendanceList: [],
    loading: false,
    error: null
  }),

  actions: {
    // Fetch today's attendance statistics
    async fetchTodayAttendance() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/attendance/today')
        this.todayAttendance = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch today\'s attendance'
        console.error('Error fetching today\'s attendance:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch attendance list with date filter
    async fetchAttendanceList(date, perPage = 10) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/attendance', {
          params: {
            date: date,
            perpage: perPage
          }
        })
        this.attendanceList = response.data.data || response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch attendance list'
        console.error('Error fetching attendance list:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Record new attendance
    async recordAttendance(cadetId) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/attendance', {
          cadet_id: cadetId,
          date: new Date().toISOString().split('T')[0]
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to record attendance'
        console.error('Error recording attendance:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
