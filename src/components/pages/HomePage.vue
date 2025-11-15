<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-[#1a4d2e] mb-2">
        Welcome back, {{ authStore.user?.name || 'Cadet' }}!
      </h1>
      <p class="text-gray-600">
        {{ currentDate }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Total Cadets -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center gap-3">
          <div class="bg-green-100 p-3 rounded-lg">
            <Users :size="24" class="text-[#1a4d2e]" />
          </div>
          <div>
            <p class="text-gray-600 text-sm">Total Cadets</p>
            <p class="text-2xl font-bold text-[#1a4d2e]">{{ stats.totalCadets }}</p>
          </div>
        </div>
      </div>

      <!-- Present Today -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-3 rounded-lg">
            <Calendar :size="24" class="text-blue-600" />
          </div>
          <div>
            <p class="text-gray-600 text-sm">Present Today</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.presentToday }}</p>
          </div>
        </div>
      </div>

      <!-- Attendance Rate -->
      <div class="bg-white rounded-lg shadow-md p-4 col-span-2">
        <div class="flex items-center gap-3">
          <div class="bg-purple-100 p-3 rounded-lg">
            <TrendingUp :size="24" class="text-purple-600" />
          </div>
          <div>
            <p class="text-gray-600 text-sm">Attendance Rate</p>
            <p class="text-2xl font-bold text-purple-600">{{ stats.attendanceRate }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-[#1a4d2e] mb-4">Recent Activity</h2>
      
      <div v-if="loading" class="flex justify-center py-8">
        <Loader class="animate-spin text-[#1a4d2e]" :size="32" />
      </div>

      <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
        No recent activity
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <p class="font-medium text-gray-800">{{ activity.cadetName }}</p>
            <p class="text-sm text-gray-500">{{ activity.cadetId }}</p>
          </div>
          <div class="text-right">
            <p
              :class="{
                'text-green-600 font-medium': activity.status === 'present',
                'text-yellow-600 font-medium': activity.status === 'late',
                'text-red-600 font-medium': activity.status === 'absent'
              }"
            >
              {{ activity.status.toUpperCase() }}
            </p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-4 pb-4">
      <button
        @click="router.push('/dashboard/qr')"
        class="bg-[#1a4d2e] text-white py-4 rounded-lg font-medium hover:bg-[#143d24] transition-colors"
      >
        Scan QR
      </button>
      <button
        @click="router.push('/dashboard/reports')"
        class="bg-white text-[#1a4d2e] py-4 rounded-lg font-medium border-2 border-[#1a4d2e] hover:bg-gray-50 transition-colors"
      >
        View Reports
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Loader, Users, Calendar, TrendingUp } from 'lucide-vue-next'
import api from '@/utils/api'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const stats = ref({
  totalCadets: 0,
  presentToday: 0,
  attendanceRate: 0
})
const recentActivity = ref([])

// Current date
const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    loading.value = true
    
    // Fetch stats
    const statsResponse = await api.get('/api/attendance/stats')
    if (statsResponse.data.success) {
      stats.value = statsResponse.data.data
    }

    // Fetch recent activity
    const activityResponse = await api.get('/api/attendance/recent')
    if (activityResponse.data.success) {
      recentActivity.value = activityResponse.data.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    // Set default values if API fails
    stats.value = {
      totalCadets: 300,
      presentToday: 0,
      attendanceRate: 0
    }
    recentActivity.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
