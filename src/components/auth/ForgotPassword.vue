<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo/Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-[#1a4d2e]">Forgot Password</h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ currentStep === 1 ? 'Enter your email to reset password' : 
             currentStep === 2 ? 'Enter verification code' : 
             'Password reset successful' }}
        </p>
      </div>

      <!-- Step 1: Email Input -->
      <div v-if="currentStep === 1" class="bg-white p-8 rounded-lg shadow-md">
        <el-form @submit.prevent="sendCode">
          <el-form-item label="Email Address">
            <el-input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              size="large"
            />
          </el-form-item>

          <el-button
            type="success"
            native-type="submit"
            class="w-full"
            size="large"
            :loading="loading"
          >
            Send Verification Code
          </el-button>
        </el-form>

        <div class="mt-4 text-center">
          <router-link to="/auth/login" class="text-sm text-[#009966] hover:underline">
            Back to Login
          </router-link>
        </div>
      </div>

      <!-- Step 2: Code & New Password -->
      <div v-if="currentStep === 2" class="bg-white p-8 rounded-lg shadow-md">
        <el-form @submit.prevent="resetPassword">
          <el-form-item label="Verification Code">
            <el-input
              v-model="code"
              placeholder="Enter 6-digit code"
              maxlength="6"
              size="large"
            />
          </el-form-item>

          <el-form-item label="New Password">
            <el-input
              v-model="newPassword"
              type="password"
              placeholder="Enter new password"
              show-password
              size="large"
            />
          </el-form-item>

          <el-form-item label="Confirm Password">
            <el-input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              show-password
              size="large"
            />
          </el-form-item>

          <el-button
            type="success"
            native-type="submit"
            class="w-full"
            size="large"
            :loading="loading"
          >
            Reset Password
          </el-button>
        </el-form>

        <div class="mt-4 text-center">
          <button
            @click="currentStep = 1"
            class="text-sm text-[#009966] hover:underline"
          >
            Back to Email
          </button>
        </div>
      </div>

      <!-- Step 3: Success -->
      <div v-if="currentStep === 3" class="bg-white p-8 rounded-lg shadow-md text-center">
        <el-icon :size="64" color="#009966" class="mb-4">
          <CircleCheck />
        </el-icon>
        <h3 class="text-xl font-bold text-[#1a4d2e] mb-2">Success!</h3>
        <p class="text-gray-600 mb-6">Your password has been reset successfully.</p>
        
        <el-button
          type="success"
          size="large"
          class="w-full"
          @click="goToLogin"
        >
          Go to Login
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const currentStep = ref(1)
const loading = ref(false)
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const sendCode = async () => {
  if (!email.value) {
    ElMessage.warning('Please enter your email')
    return
  }

  loading.value = true
  try {
    const result = await authStore.sendPasswordResetCode(email.value)
    if (result.success) {
      ElMessage.success('Verification code sent to your email')
      currentStep.value = 2
    } else {
      ElMessage.error(result.message || 'Failed to send code')
    }
  } catch (error) {
    ElMessage.error('An error occurred')
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!code.value || !newPassword.value || !confirmPassword.value) {
    ElMessage.warning('Please fill in all fields')
    return
  }

  if (code.value.length !== 6) {
    ElMessage.warning('Verification code must be 6 digits')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    ElMessage.warning('Passwords do not match')
    return
  }

  if (newPassword.value.length < 6) {
    ElMessage.warning('Password must be at least 6 characters')
    return
  }

  loading.value = true
  try {
    const result = await authStore.resetPassword({
      email: email.value,
      code: code.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value
    })

    if (result.success) {
      currentStep.value = 3
    } else {
      ElMessage.error(result.message || 'Failed to reset password')
    }
  } catch (error) {
    ElMessage.error('An error occurred')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>