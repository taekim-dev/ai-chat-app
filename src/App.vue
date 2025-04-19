<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { authenticate } from '@/services/api'

const chatStore = useChatStore()

onMounted(async () => {
  try {
    await authenticate()
    await chatStore.initialize()
  } catch (error) {
    console.error('Failed to initialize app:', error)
  }
})
</script> 