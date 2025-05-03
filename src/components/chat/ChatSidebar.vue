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
        <Button
          v-for="chat in chatStore.sortedChatList"
          :key="chat.id"
          :variant="chat.id === chatStore.activeChat?.id ? 'primary' : 'secondary'"
          class="w-full !justify-start !p-3 !h-auto text-content-400 hover:text-content-400"
          @click="selectChat(chat.id)"
        >
          <div class="flex items-center space-x-2 min-w-0">
            <span class="text-xl flex-shrink-0">{{ getPersonaIcon(chat.personaId) }}</span>
            <span class="font-medium truncate">{{ getPersonaName(chat.personaId) }}</span>
          </div>
        </Button>
      </div>
    </div>

    <!-- Start New Chat Button -->
    <div class="h-16 px-4 flex items-center border-t border-surface-200 bg-surface-50 flex-shrink-0">
      <Button variant="success" fullWidth to="/new-chat">
        Start New Chat
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import Button from '@/components/base/Button.vue'
import { usePersona } from '@/composables/usePersona'
import { useChatNavigation } from '@/composables/useChatNavigation'

interface Props {
  modelValue: boolean
}

// Props is used in template for v-model binding
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const chatStore = useChatStore()
const { getPersonaIcon, getPersonaName } = usePersona()
const { navigateToChat } = useChatNavigation()

const selectChat = async (chatId: string) => {
  chatStore.setActiveChat(chatId)
  await navigateToChat(chatId)
  emit('update:modelValue', false)
}
</script> 