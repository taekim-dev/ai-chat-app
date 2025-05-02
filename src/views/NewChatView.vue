<template>
  <div class="min-h-screen bg-surface-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center text-content-400">Choose Your AI Assistant</h1>

      <div class="grid gap-6">
        <!-- Celebrity Chat -->
        <div class="flex justify-center mt-4">
          <Button
            v-if="celebrityPersona"
            variant="ghost"
            class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl max-w-lg w-full transform hover:scale-105 transition-all duration-200"
            @click="startChat(celebrityPersona)"
          >
            <div class="flex flex-col items-center space-y-4">
              <div class="relative">
                <span class="text-5xl">{{ celebrityPersona.icon }}</span>
                <span class="absolute -right-3 -bottom-1 text-3xl">❓</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold mb-2 text-content-400">{{ celebrityPersona.name }}</h2>
                <p class="text-content-300">{{ celebrityPersona.description }}</p>
              </div>
            </div>
          </Button>
        </div>
        <!-- Regular Personas -->
        <div class="grid gap-4 md:grid-cols-2">
          <Button
            v-for="persona in regularPersonas"
            :key="persona.id"
            variant="ghost"
            class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left"
            @click="startChat(persona)"
          >
            <div class="flex items-center space-x-4">
              <span class="text-3xl">{{ persona.icon }}</span>
              <div>
                <h2 class="text-xl font-semibold text-content-400">{{ persona.name }}</h2>
                <p class="text-content-300 mt-1">{{ persona.description }}</p>
              </div>
            </div>
          </Button>
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
import Button from '@/components/base/Button.vue'

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
