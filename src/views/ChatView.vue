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
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
              <span class="text-2xl">
                {{ getPersonaIcon(chatStore.activeChat.personaId) }}
              </span>
              <h2 class="text-xl font-medium text-content-400">
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
import { usePersonaStore } from '@/stores/persona'
import { useRoute, useRouter } from 'vue-router'
import { rateLimiter } from '@/services/rateLimiter'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const personaStore = usePersonaStore()

const isSending = ref(false)
const isSidebarOpen = ref(false)
const isInputCoolingDown = ref(false)
const cooldownTimer = ref<number | null>(null)

// Initialize chat from route parameter
onMounted(async () => {
  const chatId = route.params.chatId as string | null
  const hasChat = chatStore.initializeWithChat(chatId)

  // If no chat was found/set, redirect to new chat
  if (!hasChat) {
    router.replace({ name: 'new-chat' })
  }
})

// Watch for route changes to update active chat
watch(
  () => route.params.chatId,
  newChatId => {
    if (newChatId && newChatId !== chatStore.activeChat?.id) {
      chatStore.setActiveChat(newChatId as string)
    }
  }
)

const getPersonaIcon = (personaId: string) => {
  return personaStore.getPersonaById(personaId)?.icon || '👤'
}

const getPersonaName = (personaId: string) => {
  return personaStore.getPersonaById(personaId)?.name || 'Unknown'
}

const startCooldown = (cooldownMs: number) => {
  isInputCoolingDown.value = true
  if (cooldownTimer.value) {
    clearTimeout(cooldownTimer.value)
  }
  cooldownTimer.value = window.setTimeout(() => {
    isInputCoolingDown.value = false
  }, cooldownMs)
}

const sendMessage = async (message: string) => {
  isSending.value = true

  try {
    await chatStore.sendMessage(message)
    const rateLimit = await rateLimiter.checkRateLimit(chatStore.activeChat!.id)
    if (!rateLimit.allowed && rateLimit.cooldownMs) {
      startCooldown(rateLimit.cooldownMs)
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    isSending.value = false
  }
}

const retryMessage = async () => {
  try {
    isSending.value = true
    await chatStore.retryLastFailedMessage()
    const rateLimit = await rateLimiter.checkRateLimit(chatStore.activeChat!.id)
    if (!rateLimit.allowed && rateLimit.cooldownMs) {
      startCooldown(rateLimit.cooldownMs)
    }
  } catch (error) {
    console.error('Failed to retry message:', error)
  } finally {
    isSending.value = false
  }
}
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
