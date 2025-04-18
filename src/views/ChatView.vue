<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Chat List Sidebar -->
    <div 
      :class="[
        'fixed md:relative w-64 bg-white border-r flex flex-col z-30 h-full transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Chat History Header -->
      <div class="h-16 px-4 flex justify-center items-center border-b">
        <h2 class="text-xl font-semibold">Chat History</h2>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto p-4 flex-shrink-0">
        <div class="space-y-2">
          <button
            v-for="chat in chatStore.sortedChatList"
            :key="chat.id"
            @click="selectChatAndCloseSidebar(chat.id)"
            :class="[
              'w-full p-3 text-left rounded-lg transition-colors',
              chat.id === chatStore.activeChat?.id
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            ]"
          >
            <div class="flex items-center space-x-2">
              <span class="text-xl">{{ getPersonaIcon(chat.personaId) }}</span>
              <span class="font-medium">{{ getPersonaName(chat.personaId) }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Start New Chat Button (Fixed at bottom) -->
      <div class="h-16 px-4 flex items-center border-t bg-white flex-shrink-0">
        <router-link
          to="/new-chat"
          class="btn btn-primary w-full block text-center"
        >
          Start New Chat
        </router-link>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col w-full overflow-hidden">
      <div v-if="chatStore.activeChat" class="flex-1 flex flex-col h-full">
        <!-- Chat Header -->
        <div class="h-16 px-4 flex items-center border-b bg-white flex-shrink-0">
          <div class="flex items-center justify-between w-full relative">
            <!-- Hamburger Menu for Mobile -->
            <button 
              class="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              @click="isSidebarOpen = !isSidebarOpen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Centered Title -->
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
              <span class="text-2xl">
                {{ getPersonaIcon(chatStore.activeChat.personaId) }}
              </span>
              <h2 class="text-xl font-medium">
                {{ getPersonaName(chatStore.activeChat.personaId) }}
              </h2>
            </div>

            <!-- Right side spacer to balance the hamburger menu -->
            <div class="w-10 md:hidden"></div>
          </div>
        </div>

        <!-- Messages -->
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div
            v-for="message in chatStore.activeChat.messages"
            :key="message.id"
            :class="[
              'max-w-3xl mx-auto p-4 rounded-lg',
              message.type === 'user'
                ? 'bg-primary text-white ml-auto'
                : 'bg-white shadow-sm'
            ]"
          >
            <div v-html="formatMessageHtml(message)" class="leading-relaxed"></div>
            <div 
              :class="[
                'text-xs mt-1',
                message.type === 'user' ? 'text-white/70' : 'text-gray-500'
              ]"
            >
              {{ formatTime(message.createdAt) }}
              <span v-if="message.status === 'error'" class="text-red-500 ml-2">
                Error sending message
              </span>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isSending" class="max-w-3xl mx-auto p-4 rounded-lg bg-white shadow-sm">
            <div class="flex items-center space-x-2">
              <span class="text-2xl">{{ getPersonaIcon(chatStore.activeChat.personaId) }}</span>
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <div v-if="chatStore.errorState" class="text-center text-red-500 p-4">
            {{ chatStore.errorState }}
          </div>
        </div>

        <!-- Message Input -->
        <div class="h-16 px-4 flex items-center border-t bg-white flex-shrink-0">
          <form @submit.prevent="sendMessage" class="flex space-x-4 w-full">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="input flex-1"
              :disabled="isSending"
            >
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSending || !newMessage.trim()"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <!-- No Active Chat -->
      <div 
        v-else 
        class="flex-1 flex items-center justify-center text-gray-500"
      >
        Select a chat or start a new conversation
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'
import { format } from 'date-fns'

const chatStore = useChatStore()
const personaStore = usePersonaStore()

const newMessage = ref('')
const isSending = ref(false)
const isSidebarOpen = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const getPersonaIcon = (personaId: string) => {
  return personaStore.getPersonaById(personaId)?.icon || '👤'
}

const getPersonaName = (personaId: string) => {
  return personaStore.getPersonaById(personaId)?.name || 'Unknown'
}

const formatTime = (date: Date) => {
  return format(date, 'h:mm a')
}

const selectChatAndCloseSidebar = (chatId: string) => {
  chatStore.setActiveChat(chatId)
  isSidebarOpen.value = false
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  isSending.value = true
  await chatStore.sendMessage(newMessage.value)
  newMessage.value = ''
  isSending.value = false
  await scrollToBottom()
}

const getMessageText = (message: any): string => {
  if (message.type === 'user') {
    return message.content
  }

  // For agent messages, content is already properly formatted
  return message.content
}

const formatMessageHtml = (message: any): string => {
  const text = getMessageText(message)
    .replace(/&/g, "&amp;")        // sanitize HTML
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  return `<p>${text
    .split('\n\n')
    .map(paragraph => paragraph.replace(/\n/g, '<br>'))
    .join('</p><p>')}</p>`
}

// Watch for new messages and scroll to bottom
watch(
  () => chatStore.activeChat?.messages,
  () => scrollToBottom(),
  { deep: true }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style> 