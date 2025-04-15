<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Choose Your AI Assistant</h1>
      
      <div class="grid gap-4 md:grid-cols-2">
        <button
          v-for="persona in personaStore.personas"
          :key="persona.id"
          @click="startChat(persona)"
          class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left"
        >
          <div class="flex items-center space-x-4">
            <span class="text-3xl">{{ persona.icon }}</span>
            <div>
              <h2 class="text-xl font-semibold">{{ persona.name }}</h2>
              <p class="text-gray-600 mt-1">{{ persona.description }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePersonaStore } from '@/stores/persona'
import { useChatStore } from '@/stores/chat'
import type { Persona } from '@/types'

const router = useRouter()
const personaStore = usePersonaStore()
const chatStore = useChatStore()

async function startChat(persona: Persona) {
  const chat = await chatStore.createChat(persona)
  router.push('/chat')
}
</script> 