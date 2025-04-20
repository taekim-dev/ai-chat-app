<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Choose Your AI Assistant</h1>
      
      <div class="grid gap-6">
        <!-- Celebrity Chat -->
        <div class="flex justify-center mt-4">
          <button
            v-if="celebrityPersona"
            @click="startChat(celebrityPersona)"
            class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 text-center max-w-lg w-full transform hover:scale-105 transition-transform"
          >
            <div class="flex flex-col items-center space-y-4">
              <div class="relative">
                <span class="text-5xl">{{ celebrityPersona.icon }}</span>
                <span class="absolute -right-3 -bottom-1 text-3xl">❓</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold mb-2">{{ celebrityPersona.name }}</h2>
                <p class="text-gray-600">{{ celebrityPersona.description }}</p>
              </div>
            </div>
          </button>
        </div>
        <!-- Regular Personas -->
        <div class="grid gap-4 md:grid-cols-2">
          <button
            v-for="persona in regularPersonas"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePersonaStore } from '@/stores/persona'
import { useChatStore } from '@/stores/chat'
import type { Persona } from '@/types'

const router = useRouter()
const personaStore = usePersonaStore()
const chatStore = useChatStore()

// Separate regular personas from celebrity chat
const regularPersonas = computed(() => {
  return personaStore.personas.filter(p => p.id !== 'mystery')
})

const celebrityPersona = computed(() => {
  return personaStore.personas.find(p => p.id === 'mystery')
})

async function startChat(persona: Persona) {
  await chatStore.createChat(persona)
  router.push('/chat')
}
</script> 