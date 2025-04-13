<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8">AI Chat App</h1>
      
      <div v-if="chatStore.chatList.length > 0" class="space-y-4">
        <div 
          v-for="chat in chatStore.sortedChatList" 
          :key="chat.id"
          class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <span class="text-2xl">{{ getPersonaIcon(chat.personaId) }}</span>
            <div>
              <h3 class="font-medium">{{ getPersonaName(chat.personaId) }}</h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(chat.updatedAt) }}
              </p>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="openChat(chat.id)"
              class="btn btn-primary"
            >
              Continue
            </button>
            <button 
              @click="removeChat(chat.id)"
              class="btn bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        No chats yet. Start a new conversation!
      </div>

      <div class="mt-8 text-center">
        <router-link 
          to="/new-chat"
          class="btn btn-primary text-lg px-6 py-3"
        >
          Start New Chat
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

const router = useRouter()
const chatStore = useChatStore()
const personaStore = usePersonaStore()

const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy h:mm a')
}

const getPersonaIcon = (personaId: string) => {
  return personaStore.getPersonaById(personaId)?.icon || '👤'
}

const getPersonaName = (personaId: string) => {
  return personaStore.getPersonaById(personaId)?.name || 'Unknown'
}

const openChat = (chatId: string) => {
  chatStore.setActiveChat(chatId)
  router.push('/chat')
}

const removeChat = (chatId: string) => {
  if (confirm('Are you sure you want to delete this chat?')) {
    chatStore.removeChat(chatId)
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.chat-link {
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.chat-link:hover {
  background-color: #45a049;
}
</style> 