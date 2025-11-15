<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize authentication on app load
  authStore.initializeAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #ffffff;
}
</style>
