<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <Text variant="h1" align="center" class="mb-8">AI Chat App</Text>

      <div v-if="chatStore.chatList.length > 0" class="space-y-4">
        <div
          v-for="chat in chatStore.sortedChatList"
          :key="chat.id"
          class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <span class="text-2xl">{{ getPersonaIcon(chat.personaId) }}</span>
            <div>
              <Text variant="h4" weight="medium">{{ getPersonaName(chat.personaId) }}</Text>
              <Text variant="caption" color="muted">
                {{ formatDate(chat.updatedAt) }}
              </Text>
            </div>
          </div>

          <div class="flex space-x-2">
            <Button variant="primary" @click="openChat(chat.id)">Continue</Button>
            <Button variant="error" @click="removeChat(chat.id)">Delete</Button>
          </div>
        </div>
      </div>

      <div v-else class="text-center">
        <Text variant="body" color="muted">No chats yet. Start a new conversation!</Text>
      </div>

      <div class="mt-8 text-center">
        <Button variant="success" size="lg" to="/new-chat">
          Start New Chat
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { usePersonaStore } from '@/stores/persona'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import Button from '@/components/base/Button.vue'
import Text from '@/components/base/Text.vue'

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
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.chat-link:hover {
  background-color: #45a049;
}
</style>
