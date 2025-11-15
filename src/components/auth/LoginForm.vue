<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-[#1a4d2e]">ROTC Attendance</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your account</p>
      </div>

      <el-form @submit.prevent="handleLogin">
        <el-form-item label="Email">
          <el-input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Password">
          <el-input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            show-password
            size="large"
          />
        </el-form-item>

        <div class="flex items-center justify-between mb-4">
          <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
          <router-link to="/auth/forgot-password" class="text-sm text-[#009966] hover:underline">
            Forgot password?
          </router-link>
        </div>

        <el-button
          type="success"
          native-type="submit"
          class="w-full"
          size="large"
          :loading="loading"
        >
          Sign In
        </el-button>
      </el-form>

      <div class="mt-6 text-center">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <router-link to="/auth/register" class="text-sm text-[#009966] hover:underline font-medium">
          Sign up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    ElMessage.warning('Please enter email and password')
    return
  }

  loading.value = true
  try {
    const result = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (result.success) {
      ElMessage.success('Login successful')
      router.push('/dashboard/home')
    } else {
      ElMessage.error(result.message || 'Login failed')
    }
  } catch (error) {
    ElMessage.error('An error occurred')
  } finally {
    loading.value = false
  }
}
</script>