<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header
      :user-name="authStore.user?.name || 'Guest'"
      :user-email="authStore.user?.email || ''"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <div class="pt-[73.28px] pb-[80px]">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <router-view />
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />

    <!-- Logout Confirmation Dialog -->
    <el-dialog
      v-model="showLogoutDialog"
      title="Confirm Logout"
      width="90%"
      :close-on-click-modal="false"
    >
      <p class="text-center mb-4">Are you sure you want to logout?</p>
      <template #footer>
        <div class="flex gap-3">
          <el-button class="flex-1" @click="showLogoutDialog = false">Cancel</el-button>
          <el-button class="flex-1" type="danger" @click="confirmLogout" :loading="loggingOut">
            Logout
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import Header from '@/components/dashboard/Header.vue'
import BottomNav from '@/components/dashboard/BottomNav.vue'

const router = useRouter()
const authStore = useAuthStore()

const showLogoutDialog = ref(false)
const loggingOut = ref(false)

const handleLogout = () => {
  showLogoutDialog.value = true
}

const confirmLogout = async () => {
  loggingOut.value = true
  try {
    await authStore.logout()
    ElMessage.success('Logged out successfully')
    router.push('/auth/login')
  } catch (error) {
    ElMessage.error('Failed to logout')
  } finally {
    loggingOut.value = false
    showLogoutDialog.value = false
  }
}
</script>
