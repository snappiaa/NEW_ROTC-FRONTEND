<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-dark-green to-primary-green flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-3xl font-bold text-primary-green">R</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">ROTC Attendance System</h1>
        <p class="text-white/80">Philippine Military Academy</p>
      </div>

      <!-- Auth Card -->
      <el-card shadow="always" class="!rounded-2xl">
        <!-- Tabs -->
        <el-tabs v-model="activeTab" class="auth-tabs">
          <el-tab-pane label="Login" name="login">
            <LoginForm @success="handleLoginSuccess" />
          </el-tab-pane>
          <el-tab-pane label="Register" name="register">
            <RegistrationForm @success="handleRegisterSuccess" />
          </el-tab-pane>
        </el-tabs>

        <!-- Forgot Password Link -->
        <div v-if="activeTab === 'login'" class="text-center mt-4">
          <el-button link type="primary" @click="showForgotPassword = true">
            Forgot Password?
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- Forgot Password Dialog -->
    <el-dialog
      v-model="showForgotPassword"
      title="Reset Password"
      width="400px"
      :close-on-click-modal="false"
    >
      <ForgotPasswordForm @success="handlePasswordResetSuccess" @cancel="showForgotPassword = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegistrationForm from '@/components/auth/RegistrationForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPassword.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('login')
const showForgotPassword = ref(false)

const handleLoginSuccess = () => {
  ElMessage.success('Login successful!')
  router.push('/dashboard')
}

const handleRegisterSuccess = () => {
  ElMessage.success('Registration successful! Please login.')
  activeTab.value = 'login'
}

const handlePasswordResetSuccess = () => {
  showForgotPassword.value = false
  ElMessage.success('Password reset successful! Please login.')
  activeTab.value = 'login'
}
</script>

<style scoped>
:deep(.el-card) {
  border: none;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-tabs__item.is-active) {
  color: #009966;
}

:deep(.el-tabs__active-bar) {
  background-color: #009966;
}
</style>
