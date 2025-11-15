<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary-dark-green mb-2">QR Attendance</h1>
      <p class="text-gray-600 text-sm">Scan QR codes or manually enter cadet IDs to record attendance</p>
    </div>

    <!-- Date Selection -->
    <el-card class="!rounded-xl">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Selected Date</p>
          <p class="text-lg font-bold text-primary-dark-green">{{ formattedDate }}</p>
        </div>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="Pick a date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
        />
      </div>
    </el-card>

    <!-- QR Scanner Section -->
    <el-card class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4 flex items-center gap-2">
        <QrCode :size="24" />
        QR Code Scanner
      </h3>

      <div class="flex flex-col items-center gap-4">
        <!-- QR Code Placeholder -->
        <div class="w-full max-w-xs aspect-square border-4 border-dashed border-primary-green rounded-xl flex items-center justify-center bg-gray-50">
          <div v-if="!scanning" class="text-center">
            <QrCode :size="80" class="mx-auto text-primary-green mb-2" />
            <p class="text-gray-600">Position QR Code within frame</p>
          </div>
          <div v-else class="text-center">
            <div class="animate-pulse">
              <ScanLine :size="80" class="mx-auto text-primary-green mb-2" />
              <p class="text-primary-green font-medium">Scanning...</p>
            </div>
          </div>
        </div>

        <el-button
          type="success"
          size="large"
          class="!bg-primary-green w-full max-w-xs"
          :loading="scanning"
          @click="simulateScan"
        >
          {{ scanning ? 'Scanning...' : 'Activate Scanner' }}
        </el-button>
      </div>
    </el-card>

    <!-- Manual Input Section -->
    <el-card class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4 flex items-center gap-2">
        <Keyboard :size="24" />
        Manual Input
      </h3>

      <div class="space-y-4">
        <el-input
          v-model="manualCadetId"
          size="large"
          placeholder="Enter Cadet ID (e.g., 231-0001)"
          :prefix-icon="User"
          @keyup.enter="recordManualAttendance"
        />

        <el-button
          type="success"
          size="large"
          class="!bg-primary-green w-full"
          :loading="recording"
          @click="recordManualAttendance"
        >
          Record Attendance
        </el-button>
      </div>
    </el-card>

    <!-- Live Attendance Logs -->
    <el-card class="!rounded-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-primary-dark-green flex items-center gap-2">
          <Activity :size="24" />
          LIVE ATTENDANCE LOGS
        </h3>
        <el-badge :value="(todayStats?.present || 0) + (todayStats?.late || 0)" type="success" />
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-status-present">{{ todayStats?.present || 0 }}</p>
          <p class="text-xs text-gray-600">Present</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-status-late-alt">{{ todayStats?.late || 0 }}</p>
          <p class="text-xs text-gray-600">Late</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-primary-dark-green">
            {{ (todayStats?.present || 0) + (todayStats?.late || 0) }}/{{ todayStats?.total || 0 }}
          </p>
          <p class="text-xs text-gray-600">Total</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <el-progress
        :percentage="attendancePercentage"
        :color="progressColor"
        :stroke-width="10"
      />

      <!-- Recent Records -->
      <div class="mt-4 space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="record in recentRecords"
          :key="record.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center text-white text-sm font-semibold">
              {{ record.cadet?.name?.substring(0, 2) || 'NA' }}
            </div>
            <div>
              <p class="font-medium text-primary-dark-green">{{ record.cadet?.cadetid || 'Unknown' }}</p>
              <p class="text-xs text-gray-600">{{ formatTime(record.timestamp) }}</p>
            </div>
          </div>
          <el-tag :type="getStatusTagType(record.status)" size="small">
            {{ record.status.toUpperCase() }}
          </el-tag>
        </div>

        <!-- Empty State -->
        <div v-if="recentRecords.length === 0" class="text-center py-8 text-gray-500">
          <Activity :size="48" class="mx-auto mb-2 text-gray-300" />
          <p>No attendance records yet</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useCadetStore } from '@/stores/cadet'
import { QrCode, Keyboard, User, Activity, ScanLine } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getStatusTagType, formatTime } from '@/utils/helpers'

const attendanceStore = useAttendanceStore()
const cadetStore = useCadetStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const manualCadetId = ref('')
const scanning = ref(false)
const recording = ref(false)
const recentRecords = ref([])

// Safe computed property with default values
const todayStats = computed(() => {
  return attendanceStore.todayStats || {
    present: 0,
    late: 0,
    absent: 0,
    total: 0
  }
})

const formattedDate = computed(() => {
  const date = new Date(selectedDate.value)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const attendancePercentage = computed(() => {
  const stats = todayStats.value
  if (!stats || stats.total === 0) return 0
  return Math.round(
    ((stats.present + stats.late) / stats.total) * 100
  )
})

const progressColor = computed(() => {
  const percentage = attendancePercentage.value
  if (percentage >= 75) return '#4CAF50'
  if (percentage >= 50) return '#FFC107'
  return '#ec003f'
})

const simulateScan = async () => {
  scanning.value = true
  
  try {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Get random cadet
    const randomIndex = Math.floor(Math.random() * 300) + 1
    const cadetId = `231-${String(randomIndex).padStart(4, '0')}`
    
    await recordAttendance(cadetId)
  } catch (error) {
    ElMessage.error('Scan failed')
  } finally {
    scanning.value = false
  }
}

const recordManualAttendance = async () => {
  if (!manualCadetId.value) {
    ElMessage.warning('Please enter a Cadet ID')
    return
  }
  
  recording.value = true
  try {
    await recordAttendance(manualCadetId.value)
    manualCadetId.value = ''
  } finally {
    recording.value = false
  }
}

const recordAttendance = async (cadetId) => {
  try {
    // Verify cadet exists
    const cadetResult = await cadetStore.getCadetByCadetId(cadetId)
    
    if (!cadetResult.success) {
      ElMessage.error('Cadet not found')
      return
    }
    
    // Determine status based on time
    const now = new Date()
    const cutoffTime = new Date(selectedDate.value + ' 08:30:00')
    const status = now <= cutoffTime ? 'present' : 'late'
    
    // Record attendance
    const result = await attendanceStore.recordAttendance({
      cadetid: cadetId,
      status: status,
      attendancedate: selectedDate.value,
      attendancetime: now.toTimeString().split(' ')[0],
    })
    
    if (result.success) {
      ElMessage.success(`Attendance recorded: ${status.toUpperCase()}`)
      await loadTodayStats()
      await loadRecentRecords()
    }
  } catch (error) {
    ElMessage.error(error.message || 'Failed to record attendance')
  }
}

const loadTodayStats = async () => {
  try {
    await attendanceStore.fetchTodayAttendance()
  } catch (error) {
    console.error('Failed to load today stats:', error)
  }
}

const loadRecentRecords = async () => {
  try {
    const result = await attendanceStore.fetchAttendanceByDate(selectedDate.value, {
      perpage: 10,
    })
    
    if (result.success) {
      recentRecords.value = result.data?.records || []
    }
  } catch (error) {
    console.error('Failed to load recent records:', error)
    recentRecords.value = []
  }
}

onMounted(async () => {
  await loadTodayStats()
  await loadRecentRecords()
})
</script>
