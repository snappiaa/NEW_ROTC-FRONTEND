<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-primary-dark-green">My Profile</h1>
    </div>

    <!-- Profile Card -->
    <el-card class="!rounded-xl">
      <div class="flex flex-col items-center mb-6">
        <!-- Avatar -->
        <div class="w-24 h-24 rounded-full bg-primary-green flex items-center justify-center text-white text-3xl font-bold mb-4">
          {{ userInitials }}
        </div>
        
        <!-- User Info -->
        <h2 class="text-2xl font-bold text-primary-dark-green mb-1">{{ authStore.userName }}</h2>
        <p class="text-gray-600 mb-2">{{ authStore.userEmail }}</p>
        <el-tag type="success">Active</el-tag>
      </div>

      <!-- Profile Details -->
      <div class="space-y-4 border-t pt-4">
        <div class="flex justify-between items-center py-3 border-b border-gray-100">
          <span class="text-gray-600 font-medium">Full Name</span>
          <span class="text-primary-dark-green font-semibold">{{ authStore.userName }}</span>
        </div>
        
        <div class="flex justify-between items-center py-3 border-b border-gray-100">
          <span class="text-gray-600 font-medium">Email</span>
          <span class="text-primary-dark-green font-semibold">{{ authStore.userEmail }}</span>
        </div>
        
        <div class="flex justify-between items-center py-3 border-b border-gray-100">
          <span class="text-gray-600 font-medium">Role</span>
          <span class="text-primary-dark-green font-semibold">Admin</span>
        </div>
        
        <div class="flex justify-between items-center py-3">
          <span class="text-gray-600 font-medium">Account Status</span>
          <el-tag type="success" size="small">Active</el-tag>
        </div>
      </div>
    </el-card>

    <!-- Quick Actions -->
    <el-card class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4">Quick Actions</h3>
      
      <div class="space-y-3">
        <el-button class="w-full" size="large">
          <Edit :size="20" class="mr-2" />
          Edit Profile
        </el-button>
        
        <el-button class="w-full" size="large">
          <Lock :size="20" class="mr-2" />
          Change Password
        </el-button>
        
        <el-button class="w-full" size="large">
          <HelpCircle :size="20" class="mr-2" />
          Help & Support
        </el-button>
      </div>
    </el-card>

    <!-- System Information -->
    <el-card class="!rounded-xl">
      <h3 class="text-lg font-semibold text-primary-dark-green mb-4">System Information</h3>
      
      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Version</span>
          <span class="text-primary-dark-green font-medium">1.0.0</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Last Update</span>
          <span class="text-primary-dark-green font-medium">Nov 2025</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Total Cadets</span>
          <span class="text-primary-dark-green font-medium">300</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Edit, Lock, HelpCircle } from 'lucide-vue-next'

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.userName || ''
  const names = name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return name.substring(0, 2).toUpperCase()
})
</script>
