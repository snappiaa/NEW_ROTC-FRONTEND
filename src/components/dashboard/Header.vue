<template>
  <div class="bg-primary-dark-green h-[73.28px] w-full flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50 shadow-md">
    <!-- Left: User Info (Clickable) -->
    <button @click="navigateToProfile" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <!-- Avatar -->
      <div class="bg-primary-green rounded-full w-10 h-10 flex items-center justify-center">
        <span class="font-arimo text-sm leading-5 text-white font-semibold">{{ userInitials }}</span>
      </div>
      
      <!-- User Details -->
      <div class="text-left">
        <p class="font-arimo text-sm leading-5 text-white font-medium">{{ userName }}</p>
        <p class="font-arimo text-xs leading-4 text-white/80">{{ userEmail }}</p>
      </div>
    </button>

    <!-- Right: Logout Button with Arrow Icon -->
    <button
      @click="emit('logout')"
      class="h-9 w-10 rounded-lg border border-primary-green flex items-center justify-center hover:bg-white/10 transition-colors"
    >
      <LogOut :size="20" class="text-white/80" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'

const router = useRouter()

const props = defineProps({
  userName: {
    type: String,
    default: 'SOPHIE P. RUTOL',
  },
  userEmail: {
    type: String,
    default: 'sophie@rotc.edu',
  },
})

const emit = defineEmits(['logout'])

const userInitials = computed(() => {
  const names = props.userName.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return props.userName.substring(0, 2).toUpperCase()
})

const navigateToProfile = () => {
  router.push('/profile')
}
</script>
