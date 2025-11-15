<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary-dark-green mb-2">Reports</h1>
      <p class="text-gray-600 text-sm">Generate and download attendance reports</p>
    </div>

    <!-- Date Range Selector -->
    <el-card class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4">Select Date Range</h3>
      
      <div class="space-y-4">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          class="w-full"
          size="large"
        />

        <div class="grid grid-cols-2 gap-3">
          <el-button
            type="success"
            size="large"
            class="!bg-primary-green"
            :loading="generating"
            @click="generateReport"
          >
            <FileText :size="20" class="mr-2" />
            Generate Report
          </el-button>

          <el-button
            size="large"
            :disabled="!reportGenerated"
            @click="downloadReport"
          >
            <Download :size="20" class="mr-2" />
            Download CSV
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Statistics (shown after generate) -->
    <div v-if="reportGenerated" class="grid grid-cols-2 gap-4">
      <div
        @click="showStudentList('all')"
        class="bg-white rounded-xl border-2 border-primary-green p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <p class="text-sm text-gray-600 mb-1">Total Students</p>
        <p class="text-3xl font-bold text-primary-dark-green">{{ reportStats.totalCadets }}</p>
      </div>

      <div
        @click="showStudentList('present')"
        class="bg-white rounded-xl border-2 border-status-present p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <p class="text-sm text-gray-600 mb-1">Present</p>
        <p class="text-3xl font-bold text-status-present">{{ reportStats.totalPresent }}</p>
      </div>

      <div
        @click="showStudentList('late')"
        class="bg-white rounded-xl border-2 border-status-late-alt p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <p class="text-sm text-gray-600 mb-1">Late</p>
        <p class="text-3xl font-bold text-status-late-alt">{{ reportStats.totalLate }}</p>
      </div>

      <div
        @click="showStudentList('absent')"
        class="bg-white rounded-xl border-2 border-status-absent p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <p class="text-sm text-gray-600 mb-1">Absent</p>
        <p class="text-3xl font-bold text-status-absent">{{ reportStats.totalAbsent }}</p>
      </div>
    </div>

    <!-- Daily Breakdown (shown after generate) -->
    <el-card v-if="reportGenerated" class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4">Daily Breakdown</h3>
      
      <div class="space-y-3">
        <div
          v-for="day in dailyData"
          :key="day.date"
          class="p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="font-medium text-primary-dark-green">{{ formatDate(day.date) }}</p>
            <el-tag type="success" size="small">
              {{ day.attendanceRate }}% Attendance
            </el-tag>
          </div>
          
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div class="text-center">
              <p class="text-xl font-bold text-status-present">{{ day.present }}</p>
              <p class="text-gray-600 text-xs">Present</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-status-late-alt">{{ day.late }}</p>
              <p class="text-gray-600 text-xs">Late</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-status-absent">{{ day.absent }}</p>
              <p class="text-gray-600 text-xs">Absent</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Student List Dialog -->
    <el-dialog
      v-model="showListDialog"
      :title="`${selectedStatus.toUpperCase()} Students`"
      width="90%"
    >
      <div v-loading="loadingList">
        <el-input
          v-model="listSearch"
          placeholder="Search by Cadet ID or Name..."
          clearable
          class="mb-4"
        />

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="student in filteredStudentList"
            :key="student.cadetId"
            class="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <div>
              <p class="font-medium text-primary-dark-green">{{ student.cadetId }}</p>
              <p class="text-sm text-gray-600">{{ student.designation }}</p>
            </div>
            <el-tag :type="getStatusTagType(student.status)" size="small">
              {{ student.status?.toUpperCase() || 'N/A' }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { FileText, Download } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { getStatusTagType, formatDate } from '@/utils/helpers'

const dateRange = ref([])
const generating = ref(false)
const reportGenerated = ref(false)
const reportStats = ref({
  totalCadets: 0,
  totalPresent: 0,
  totalLate: 0,
  totalAbsent: 0,
})
const dailyData = ref([])
const showListDialog = ref(false)
const selectedStatus = ref('all')
const studentList = ref([])
const listSearch = ref('')
const loadingList = ref(false)

const filteredStudentList = computed(() => {
  if (!listSearch.value) return studentList.value
  
  const query = listSearch.value.toLowerCase()
  return studentList.value.filter(
    (s) =>
      s.cadetId.toLowerCase().includes(query) ||
      s.name?.toLowerCase().includes(query)
  )
})

const generateReport = async () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('Please select a date range')
    return
  }

  generating.value = true
  try {
    const [startDate, endDate] = dateRange.value
    const response = await api.get('/api/reports', {
      params: { start_date: startDate, end_date: endDate },
    })

    if (response.success) {
      reportStats.value = {
        totalCadets: response.data.total_cadets,
        totalPresent: response.data.overall_statistics.total_present,
        totalLate: response.data.overall_statistics.total_late,
        totalAbsent: response.data.overall_statistics.total_absent,
      }
      dailyData.value = response.data.daily_data
      reportGenerated.value = true
      ElMessage.success('Report generated successfully')
    }
  } catch (error) {
    ElMessage.error('Failed to generate report')
  } finally {
    generating.value = false
  }
}

const downloadReport = async () => {
  try {
    const [startDate, endDate] = dateRange.value
    const response = await api.get('/api/reports/download', {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob',
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `report-${startDate}-to-${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    ElMessage.success('Report downloaded')
  } catch (error) {
    ElMessage.error('Failed to download report')
  }
}

const showStudentList = async (status) => {
  if (!dateRange.value || dateRange.value.length !== 2) return

  selectedStatus.value = status
  showListDialog.value = true
  loadingList.value = true

  try {
    const [startDate] = dateRange.value
    const response = await api.get('/api/reports/students', {
      params: {
        date: startDate,
        status: status,
        per_page: 1000,
      },
    })

    if (response.success) {
      studentList.value = response.data.students
    }
  } catch (error) {
    ElMessage.error('Failed to load student list')
  } finally {
    loadingList.value = false
  }
}
</script>
