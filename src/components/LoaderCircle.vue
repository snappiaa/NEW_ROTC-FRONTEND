<template>
  <div class="loader-circle" aria-label="Loading">
    <svg class="animate-spin" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" stroke="#009966" stroke-width="4" fill="none" opacity="0.2" />
      <circle cx="16" cy="16" r="14" stroke="#009966" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="80" stroke-dashoffset="60" />
    </svg>
  </div>
</template>

<script setup>
// No additional code needed
</script>

<style scoped>
.loader-circle { display: flex; justify-content: center; align-items: center; height: 64px; }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
