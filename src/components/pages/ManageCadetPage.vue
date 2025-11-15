<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary-dark-green mb-2">Manage Cadets</h1>
      <p class="text-gray-600 text-sm">Add new cadets and view all registered cadets</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-3 gap-4">
      <div
        @click="filterBySex('all')"
        class="bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        :class="selectedFilter === 'all' ? 'border-primary-green' : 'border-gray-200'"
      >
        <p class="text-sm text-gray-600 mb-1">Total</p>
        <p class="text-2xl font-bold text-primary-dark-green">{{ cadetStore.stats.total }}</p>
      </div>

      <div
        @click="filterBySex('Female')"
        class="bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        :class="selectedFilter === 'Female' ? 'border-pink-400' : 'border-gray-200'"
      >
        <p class="text-sm text-gray-600 mb-1">Female</p>
        <p class="text-2xl font-bold text-pink-600">{{ cadetStore.stats.female }}</p>
      </div>

      <div
        @click="filterBySex('Male')"
        class="bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        :class="selectedFilter === 'Male' ? 'border-blue-400' : 'border-gray-200'"
      >
        <p class="text-sm text-gray-600 mb-1">Male</p>
        <p class="text-2xl font-bold text-blue-600">{{ cadetStore.stats.male }}</p>
      </div>
    </div>

    <!-- Add Cadet Button -->
    <el-button
      type="success"
      size="large"
      class="w-full !bg-primary-green"
      @click="showAddDialog = true"
    >
      <Plus :size="20" class="mr-2" />
      Add New Cadet
    </el-button>

    <!-- Search Bar -->
    <el-card class="!rounded-xl">
      <el-input
        v-model="searchQuery"
        size="large"
        placeholder="Search by Cadet ID, Name, College, or Platoon..."
        clearable
        :prefix-icon="Search"
      />
    </el-card>

    <!-- Cadet Table -->
    <el-card class="!rounded-xl">
      <div v-loading="cadetStore.loading">
        <el-table
          :data="paginatedCadets"
          style="width: 100%"
          :empty-text="'No cadets found'"
          stripe
        >
          <el-table-column prop="cadet_id" label="Cadet ID" width="120" fixed />
          
          <el-table-column prop="course_year" label="College" width="150" />
          
          <el-table-column prop="name" label="Name" min-width="150" />
          
          <el-table-column label="Sex" width="100">
            <template #default="{ row }">
              <el-tag
                :type="row.sex === 'Female' ? 'danger' : 'primary'"
                size="small"
              >
                {{ row.sex === 'Female' ? 'F' : 'M' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="designation" label="Platoon" min-width="150" />
        </el-table>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredCadets.length"
            layout="prev, pager, next, total"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>

    <!-- Add Cadet Dialog -->
    <el-dialog
      v-model="showAddDialog"
      title="Add New Cadet"
      width="90%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <!-- ✅ Changed prop from cadetId to cadet_id -->
        <el-form-item label="Student ID" prop="cadet_id">
          <el-input
            v-model="form.cadet_id"
            placeholder="e.g., 231-0420"
            size="large"
          />
        </el-form-item>

        <!-- ✅ Changed prop from courseYear to course_year -->
        <el-form-item label="Course" prop="course_year">
          <el-input
            v-model="form.course_year"
            placeholder="e.g., BSIT, BSCS, BSBA"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Full Name" prop="name">
          <el-input
            v-model="form.name"
            placeholder="Enter full name"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Sex" prop="sex">
          <el-radio-group v-model="form.sex" class="w-full">
            <el-radio value="Male" size="large" class="w-1/2">Male</el-radio>
            <el-radio value="Female" size="large" class="w-1/2">Female</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Platoon/Company" prop="designation">
          <el-input
            v-model="form.designation"
            placeholder="e.g., Alpha Company, Bravo Platoon"
            size="large"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button
          type="success"
          :loading="submitting"
          @click="handleSubmit"
        >
          Add Cadet
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCadetStore } from '@/stores/cadet'
import { Plus, Search } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const cadetStore = useCadetStore()

const showAddDialog = ref(false)
const formRef = ref(null)
const submitting = ref(false)
const searchQuery = ref('')
const selectedFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10

// ✅ Form model - snake_case
const form = ref({
  cadet_id: '',
  name: '',
  designation: '',
  course_year: '',
  sex: 'Male',
})

// ✅ Validation rules - MUST match form model (snake_case)
const rules = {
  cadet_id: [
    { required: true, message: 'Please enter Student ID', trigger: 'blur' },
  ],
  name: [
    { required: true, message: 'Please enter full name', trigger: 'blur' },
  ],
  designation: [
    { required: true, message: 'Please enter Platoon/Company', trigger: 'blur' },
  ],
  course_year: [
    { required: true, message: 'Please enter course', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: 'Please select sex', trigger: 'change' },
  ],
}

const filteredCadets = computed(() => {
  let cadets = cadetStore.cadets

  // Filter by sex
  if (selectedFilter.value !== 'all') {
    cadets = cadets.filter((c) => c.sex === selectedFilter.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cadets = cadets.filter(
      (c) =>
        c.cadet_id?.toLowerCase().includes(query) ||
        c.name?.toLowerCase().includes(query) ||
        c.course_year?.toLowerCase().includes(query) ||
        c.designation?.toLowerCase().includes(query)
    )
  }

  return cadets
})

const paginatedCadets = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredCadets.value.slice(start, end)
})

const filterBySex = (sex) => {
  selectedFilter.value = sex
  currentPage.value = 1
}

const handlePageChange = () => {
  // Pagination handled automatically
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // Validate form first
    await formRef.value.validate()
    
    submitting.value = true
    
    // Data is already in the correct format (snake_case)
    const result = await cadetStore.addCadet(form.value)
    
    if (result.success) {
      ElMessage.success('Cadet added successfully!')
      closeDialog()
      await loadCadets()
    } else {
      ElMessage.error(result.message || 'Failed to add cadet')
    }
  } catch (error) {
    console.error('Form validation failed:', error)
  } finally {
    submitting.value = false
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    cadet_id: '',
    name: '',
    designation: '',
    course_year: '',
    sex: 'Male',
  }
  formRef.value?.resetFields()
}

const loadCadets = async () => {
  await cadetStore.fetchCadets({ per_page: 1000 })
  await cadetStore.fetchCadetCount()
}

onMounted(() => {
  loadCadets()
})
</script>
