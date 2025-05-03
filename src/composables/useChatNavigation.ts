import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import type { Persona } from '@/types'

export function useChatNavigation() {
  const router = useRouter()
  const chatStore = useChatStore()

  const navigateToChat = async (chatId: string) => {
    await router.push(`/chat/${chatId}`)
  }

  const startNewChat = async (persona: Persona) => {
    const newChat = await chatStore.createChat(persona)
    await navigateToChat(newChat.id)
    return newChat
  }

  const initializeChat = async (chatId: string | null) => {
    const success = await chatStore.initializeWithChat(chatId)
    if (!success) {
      await router.replace({ name: 'new-chat' })
    }
    return success
  }

  const removeChat = async (chatId: string) => {
    await chatStore.removeChat(chatId)
    // If we're in the chat view and the deleted chat was active,
    // navigate back to home
    if (router.currentRoute.value.name === 'chat') {
      await router.replace({ name: 'home' })
    }
  }

  return {
    navigateToChat,
    startNewChat,
    initializeChat,
    removeChat
  }
} 