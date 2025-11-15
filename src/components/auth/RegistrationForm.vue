<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-[#1a4d2e]">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600">Join ROTC Attendance System</p>
      </div>

      <el-form @submit.prevent="handleRegister">
        <el-form-item label="Full Name">
          <el-input
            v-model="formData.name"
            placeholder="Enter your full name"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Email">
          <el-input
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="Enter password (min. 6 characters)"
            show-password
            size="large"
          />
        </el-form-item>

        <el-form-item label="Confirm Password">
          <el-input
            v-model="formData.passwordConfirmation"
            type="password"
            placeholder="Confirm your password"
            show-password
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="agreeToTerms">
            I agree to the Terms and Conditions
          </el-checkbox>
        </el-form-item>

        <el-button
          type="success"
          native-type="submit"
          class="w-full"
          size="large"
          :loading="loading"
        >
          Create Account
        </el-button>
      </el-form>

      <div class="mt-6 text-center">
        <span class="text-sm text-gray-600">Already have an account? </span>
        <router-link to="/auth/login" class="text-sm text-[#009966] hover:underline font-medium">
          Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

const agreeToTerms = ref(false)
const loading = ref(false)

const handleRegister = async () => {
  if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirmation) {
    ElMessage.warning('Please fill in all fields')
    return
  }

  if (formData.password !== formData.passwordConfirmation) {
    ElMessage.warning('Passwords do not match')
    return
  }

  if (formData.password.length < 6) {
    ElMessage.warning('Password must be at least 6 characters')
    return
  }

  if (!agreeToTerms.value) {
    ElMessage.warning('Please agree to the terms and conditions')
    return
  }

  loading.value = true
  try {
    const result = await authStore.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.passwordConfirmation
    })

    if (result.success) {
      ElMessage.success('Registration successful! Please login.')
      router.push('/auth/login')
    } else {
      ElMessage.error(result.message || 'Registration failed')
    }
  } catch (error) {
    ElMessage.error('An error occurred')
  } finally {
    loading.value = false
  }
}
</script>