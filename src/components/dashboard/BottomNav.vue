<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex justify-around items-center h-16 max-w-7xl mx-auto px-4">
      <!-- Home -->
      <button
        @click="navigate('home')"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-2 transition-colors',
          isActive('home') ? 'text-[#1a4d2e]' : 'text-gray-500'
        ]"
      >
        <Home :size="24" />
        <span class="text-xs mt-1">Home</span>
      </button>

      <!-- Profile -->
      <button
        @click="navigate('profile')"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-2 transition-colors',
          isActive('profile') ? 'text-[#1a4d2e]' : 'text-gray-500'
        ]"
      >
        <User :size="24" />
        <span class="text-xs mt-1">Profile</span>
      </button>

      <!-- QR Scan -->
      <button
        @click="navigate('qr')"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-2 transition-colors',
          isActive('qr') ? 'text-[#1a4d2e]' : 'text-gray-500'
        ]"
      >
        <QrCode :size="24" />
        <span class="text-xs mt-1">QR Scan</span>
      </button>

      <!-- Cadets -->
      <button
        @click="navigate('cadets')"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-2 transition-colors',
          isActive('cadets') ? 'text-[#1a4d2e]' : 'text-gray-500'
        ]"
      >
        <Users :size="24" />
        <span class="text-xs mt-1">Cadets</span>
      </button>

      <!-- Reports -->
      <button
        @click="navigate('reports')"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-2 transition-colors',
          isActive('reports') ? 'text-[#1a4d2e]' : 'text-gray-500'
        ]"
      >
        <FileText :size="24" />
        <span class="text-xs mt-1">Reports</span>
      </button>

      <!-- History -->
      <button
        @click="navigate('history')"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-2 transition-colors',
          isActive('history') ? 'text-[#1a4d2e]' : 'text-gray-500'
        ]"
      >
        <Clock :size="24" />
        <span class="text-xs mt-1">History</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Home, User, QrCode, Users, FileText, Clock } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navigate = (page) => {
  router.push(`/dashboard/${page}`)
}

const isActive = (page) => {
  return route.path === `/dashboard/${page}`
}
</script>
