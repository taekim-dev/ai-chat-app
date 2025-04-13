<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">
        Who would you like to chat with?
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          v-for="persona in personaStore.personas"
          :key="persona.id"
          @click="selectPersona(persona)"
          class="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <span class="text-4xl mb-4">{{ persona.icon }}</span>
          <span class="text-xl font-medium">{{ persona.name }}</span>
        </button>
      </div>

      <div class="mt-8 text-center">
        <router-link 
          to="/"
          class="text-gray-600 hover:text-gray-800"
        >
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'
import type { Persona } from '@/types'

const router = useRouter()
const chatStore = useChatStore()
const personaStore = usePersonaStore()

const selectPersona = async (persona: Persona) => {
  await chatStore.createChat(persona)
  router.push('/chat')
}
</script> 