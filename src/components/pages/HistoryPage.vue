<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary-dark-green mb-2">History</h1>
      <p class="text-gray-600 text-sm">View past attendance records and trends</p>
    </div>

    <!-- Month Selector -->
    <el-card class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4">Select Month</h3>
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        placeholder="Select month"
        format="MMMM YYYY"
        class="w-full"
        size="large"
        @change="handleMonthChange"
      />
    </el-card>

    <!-- Weekend Attendance Cards -->
    <div v-if="weekendDates.length > 0" class="space-y-4">
      <h3 class="text-lg font-semibold text-primary-dark-green">Weekend Attendance</h3>
      
      <div
        v-for="weekend in weekendDates"
        :key="weekend.date"
        class="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="font-bold text-primary-dark-green">{{ formatDate(weekend.date) }}</p>
            <p class="text-sm text-gray-600">{{ weekend.dayName }}</p>
          </div>
          <el-tag type="success" size="small">
            {{ weekend.attendanceRate }}%
          </el-tag>
        </div>

        <div class="grid grid-cols-3 gap-3 mb-3">
          <el-button
            size="small"
            type="success"
            plain
            @click="showDateDetails(weekend.date, 'present')"
          >
            Present: {{ weekend.present }}
          </el-button>
          
          <el-button
            size="small"
            type="warning"
            plain
            @click="showDateDetails(weekend.date, 'late')"
          >
            Late: {{ weekend.late }}
          </el-button>
          
          <el-button
            size="small"
            type="danger"
            plain
            @click="showDateDetails(weekend.date, 'absent')"
          >
            Absent: {{ weekend.absent }}
          </el-button>
        </div>

        <el-button
          size="small"
          class="w-full"
          @click="downloadDateReport(weekend.date)"
        >
          <Download :size="16" class="mr-2" />
          Download Report
        </el-button>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center py-8 text-gray-500">
      <p>No attendance records for this month</p>
    </div>

    <!-- Date Details Dialog -->
    <el-dialog
      v-model="showDetailsDialog"
      :title="`${selectedStatus.toUpperCase()} - ${selectedDate}`"
      width="90%"
    >
      <div v-loading="loadingDetails">
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="record in dateRecords"
            :key="record.cadetId"
            class="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <div>
              <p class="font-medium text-primary-dark-green">{{ record.cadetId }}</p>
              <p class="text-sm text-gray-600">{{ record.designation }}</p>
              <p v-if="record.timestamp" class="text-xs text-gray-500">
                {{ formatTime(record.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { Download } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { formatDate, formatTime } from '@/utils/helpers'

const selectedMonth = ref(new Date())
const weekendDates = ref([])
const loading = ref(false)
const showDetailsDialog = ref(false)
const loadingDetails = ref(false)
const selectedDate = ref('')
const selectedStatus = ref('')
const dateRecords = ref([])

const handleMonthChange = async () => {
  await loadMonthlyData()
}

const loadMonthlyData = async () => {
  loading.value = true
  try {
    const month = selectedMonth.value.getMonth() + 1
    const year = selectedMonth.value.getFullYear()

    const response = await api.get('/api/history', {
      params: { month, year },
    })

    if (response.success) {
      weekendDates.value = response.data.weekend_dates
    }
  } catch (error) {
    ElMessage.error('Failed to load history')
  } finally {
    loading.value = false
  }
}

const showDateDetails = async (date, status) => {
  selectedDate.value = date
  selectedStatus.value = status
  showDetailsDialog.value = true
  loadingDetails.value = true

  try {
    const response = await api.get('/api/history/date', {
      params: {
        date,
        status,
        per_page: 1000,
      },
    })

    if (response.success) {
      dateRecords.value = response.data.records
    }
  } catch (error) {
    ElMessage.error('Failed to load details')
  } finally {
    loadingDetails.value = false
  }
}

const downloadDateReport = async (date) => {
  try {
    const response = await api.get('/api/history/download', {
      params: { date },
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `history-${date}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    ElMessage.success('Report downloaded')
  } catch (error) {
    ElMessage.error('Failed to download report')
  }
}

onMounted(() => {
  loadMonthlyData()
})
</script>
