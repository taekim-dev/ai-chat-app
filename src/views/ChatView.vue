<template>
  <div class="flex h-screen bg-surface-50">
    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-neutral-900 bg-opacity-50 md:hidden z-20"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Chat List Sidebar -->
    <ChatSidebar v-model="isSidebarOpen" />

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col w-full overflow-hidden">
      <div v-if="chatStore.activeChat" class="flex-1 flex flex-col h-full">
        <!-- Chat Header -->
        <div class="h-16 px-4 flex items-center border-b border-surface-200 bg-surface-50 flex-shrink-0 sticky top-0 z-10">
          <div class="flex items-center justify-between w-full relative">
            <!-- Hamburger Menu for Mobile -->
            <button
              class="md:hidden p-2 hover:bg-surface-100 rounded-lg text-content-300"
              @click="isSidebarOpen = !isSidebarOpen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Centered Title -->
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3 whitespace-nowrap">
              <span class="text-2xl flex-shrink-0">
                {{ getPersonaIcon(chatStore.activeChat.personaId) }}
              </span>
              <h2 class="text-xl font-medium text-content-400 truncate">
                {{ getPersonaName(chatStore.activeChat.personaId) }}
              </h2>
            </div>

            <!-- Right side spacer to balance the hamburger menu -->
            <div class="w-10 md:hidden"></div>
          </div>
        </div>

        <!-- Messages -->
        <ChatMessages
          :messages="chatStore.activeChat.messages"
          :is-sending="isSending"
          :error="chatStore.errorState"
          :can-retry="!!chatStore.lastFailedMessage"
          :persona-icon="getPersonaIcon(chatStore.activeChat.personaId)"
          @retry="retryMessage"
        />

        <!-- Message Input -->
        <ChatInput
          :disabled="isSending"
          :is-input-cooling-down="isInputCoolingDown"
          @send="sendMessage"
        />
      </div>

      <!-- No Active Chat -->
      <div v-else class="flex-1 flex items-center justify-center text-content-200">
        Select a chat or start a new conversation
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useRoute } from 'vue-router'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import { useChat } from '@/composables/useChat'
import { usePersona } from '@/composables/usePersona'
import { useChatNavigation } from '@/composables/useChatNavigation'

const route = useRoute()
const chatStore = useChatStore()
const { getPersonaIcon, getPersonaName } = usePersona()
const { isSending, isInputCoolingDown, sendMessage, retryMessage } = useChat()
const { initializeChat } = useChatNavigation()

const isSidebarOpen = ref(false)

// Initialize chat from route parameter
onMounted(async () => {
  const chatId = route.params.chatId as string | null
  await initializeChat(chatId)
})

// Watch for route changes to update active chat
watch(
  () => route.params.chatId,
  async (newChatId) => {
    if (newChatId) {
      await initializeChat(newChatId as string)
    }
  }
)
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.text-shadow {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.typing-animation {
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
  white-space: pre-wrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: fadeInMessage 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform-origin: top;
  will-change: transform, opacity;
}

@keyframes fadeInMessage {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
