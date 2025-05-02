<template>
  <div
    :class="[
      'fixed md:relative w-64 bg-surface-50 border-r border-surface-200 flex flex-col z-30 h-full transition-transform duration-300 ease-in-out',
      modelValue ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Chat History Header -->
    <div class="h-16 px-4 flex justify-center items-center border-b border-surface-200">
      <h2 class="text-xl font-semibold text-content-400">Chat History</h2>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto p-4 flex-shrink-0">
      <div class="space-y-2">
        <button
          v-for="chat in chatStore.sortedChatList"
          :key="chat.id"
          :class="[
            'w-full p-3 text-left rounded-lg transition-colors duration-200',
            chat.id === chatStore.activeChat?.id 
              ? 'bg-primary-500 text-white' 
              : 'hover:bg-surface-100 text-content-300'
          ]"
          @click="selectChat(chat.id)"
        >
          <div class="flex items-center space-x-2">
            <span class="text-xl">{{ getPersonaIcon(chat.personaId) }}</span>
            <span class="font-medium">{{ getPersonaName(chat.personaId) }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Start New Chat Button -->
    <div class="h-16 px-4 flex items-center border-t border-surface-200 bg-surface-50 flex-shrink-0">
      <router-link to="/new-chat" class="btn btn-primary w-full block text-center">
        Start New Chat
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'
import { useRouter } from 'vue-router'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const chatStore = useChatStore()
const personaStore = usePersonaStore()

const getPersonaIcon = (personaId: string) => personaStore.getPersonaById(personaId)?.icon || '👤'
const getPersonaName = (personaId: string) => personaStore.getPersonaById(personaId)?.name || 'Unknown'

const selectChat = async (chatId: string) => {
  await router.replace({ name: 'chat', params: { chatId } })
  emit('update:modelValue', false)
}
</script> 